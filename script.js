// ========================================
// AGROLINK - Secure Farmer-Buyer Platform
// JavaScript Core Logic
// ========================================

// ========================================
// 1. UTILITY FUNCTIONS
// ========================================

// Simple SHA256-like hash (simulated - not cryptographically secure)
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'HASH_' + Math.abs(hash).toString(16).substring(0, 12);
}

// Simple password hashing (bcrypt simulation)
function hashPassword(password) {
  return 'bcrypt_' + btoa(password + 'SALT_AGROLINK_2026');
}

// Verify hashed password
function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

// Sanitize input to prevent XSS
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Generate JWT-like token
function generateToken(user) {
  const header = btoa('{"alg":"HS256","typ":"JWT"}');
  const payload = btoa(JSON.stringify({
    sub: user.id,
    role: user.role,
    email: user.email,
    iat: Date.now(),
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  }));
  const signature = btoa('AGROLINK_SECRET_KEY_2026');
  return `${header}.${payload}.${signature}`;
}

// Decode and validate JWT token
function validateToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp < Date.now()) return null;
    
    return payload;
  } catch (e) {
    return null;
  }
}

// ========================================
// 2. AUTHENTICATION SYSTEM
// ========================================

const AuthSystem = {
  // Initialize users database
  initUsers() {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([]));
    }
  },

  // Register new user
  register(name, email, password, role) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'User already exists' };
    }

    const user = {
      id: 'USER_' + Date.now(),
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      password: hashPassword(password),
      role: role,
      createdAt: new Date().toISOString(),
      verified: false
    };

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Log registration
    this.logLoginAttempt(email, 'registration', true);
    
    return { success: true, message: 'Registration successful', user };
  },

  // Login user
  login(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);

    if (!user) {
      this.logLoginAttempt(email, 'login', false, 'User not found');
      return { success: false, message: 'Invalid email or password' };
    }

    if (!verifyPassword(password, user.password)) {
      this.logLoginAttempt(email, 'login', false, 'Wrong password');
      return { success: false, message: 'Invalid email or password' };
    }

    // Check rate limiting
    if (!this.checkRateLimit(email)) {
      return { success: false, message: 'Too many login attempts. Try again later.' };
    }

    const token = generateToken(user);
    localStorage.setItem('currentUser', JSON.stringify({ ...user, token }));
    localStorage.setItem('authToken', token);
    
    this.logLoginAttempt(email, 'login', true);
    
    return { success: true, message: 'Login successful', user: { ...user, token } };
  },

  // Logout user
  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  },

  // Get current user
  getCurrentUser() {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    const payload = validateToken(token);
    if (!payload) return null;
    
    return JSON.parse(localStorage.getItem('currentUser'));
  },

  // Check if user is authenticated
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  // Get user role
  getUserRole() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  },

  // ========================================
  // 3. RATE LIMITING
  // ========================================

  checkRateLimit(email) {
    const key = `rateLimit_${email}`;
    const attempts = JSON.parse(localStorage.getItem(key)) || { count: 0, resetTime: 0 };
    
    const now = Date.now();
    
    // Reset if time window has passed
    if (now > attempts.resetTime) {
      attempts.count = 0;
      attempts.resetTime = now + (15 * 60 * 1000); // 15 minutes
    }
    
    attempts.count++;
    localStorage.setItem(key, JSON.stringify(attempts));
    
    return attempts.count <= 5; // Max 5 attempts per 15 minutes
  },

  // ========================================
  // 4. LOGIN HISTORY & LOGGING
  // ========================================

  logLoginAttempt(email, type, success, reason = '') {
    const logs = JSON.parse(localStorage.getItem('loginLogs')) || [];
    
    const isSuspicious = !success && ['Wrong password', 'User not found'].includes(reason);
    
    logs.push({
      id: 'LOG_' + Date.now(),
      email: email,
      type: type,
      success: success,
      timestamp: new Date().toISOString(),
      ipAddress: 'LOCAL_' + Math.random().toString(36).substr(2, 9),
      reason: reason,
      suspicious: isSuspicious
    });
    
    localStorage.setItem('loginLogs', JSON.stringify(logs));
  },

  getLoginLogs() {
    return JSON.parse(localStorage.getItem('loginLogs')) || [];
  },

  getSuspiciousActivities() {
    const logs = this.getLoginLogs();
    return logs.filter(log => log.suspicious).slice(-50);
  }
};

// ========================================
// 5. FARMER DATA MANAGEMENT
// ========================================

const FarmerSystem = {
  // Add new farmer listing
  addListing(cropName, cropImage, location, status) {
    const user = AuthSystem.getCurrentUser();
    if (!user || user.role !== 'farmer') {
      return { success: false, message: 'Unauthorized' };
    }

    const listings = JSON.parse(localStorage.getItem('farmerListings')) || [];
    
    const listing = {
      id: 'LISTING_' + Date.now(),
      farmerId: user.id,
      farmerName: user.name,
      farmerEmail: user.email,
      cropName: sanitizeInput(cropName),
      cropImage: cropImage,
      location: sanitizeInput(location),
      status: status,
      likes: 0,
      transactionHash: simpleHash(cropName + location + Date.now()),
      createdAt: new Date().toISOString(),
      verified: true
    };

    listings.push(listing);
    localStorage.setItem('farmerListings', JSON.stringify(listings));
    
    // Add to history
    this.addToHistory(listing);
    
    return { success: true, message: 'Listing created successfully', listing };
  },

  // Get all listings
  getAllListings() {
    return JSON.parse(localStorage.getItem('farmerListings')) || [];
  },

  // Get user's listings
  getUserListings(userId) {
    const listings = this.getAllListings();
    return listings.filter(l => l.farmerId === userId);
  },

  // Like a listing
  likeListing(listingId) {
    const listings = JSON.parse(localStorage.getItem('farmerListings')) || [];
    const listing = listings.find(l => l.id === listingId);
    
    if (listing) {
      listing.likes = (listing.likes || 0) + 1;
      localStorage.setItem('farmerListings', JSON.stringify(listings));
      return { success: true, likes: listing.likes };
    }
    
    return { success: false };
  },

  // Add to history log
  addToHistory(listing) {
    const history = JSON.parse(localStorage.getItem('farmerHistory')) || [];
    history.push({
      id: 'HIST_' + Date.now(),
      listing: listing,
      action: 'created',
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('farmerHistory', JSON.stringify(history));
  },

  getHistory() {
    return JSON.parse(localStorage.getItem('farmerHistory')) || [];
  }
};

// ========================================
// 6. BLOCKCHAIN-LIKE TRANSACTION SYSTEM
// ========================================

const TransactionSystem = {
  recordInteraction(buyerId, listingId, interactionType) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    const transaction = {
      id: 'TXN_' + Date.now(),
      buyerId: buyerId,
      listingId: listingId,
      type: interactionType,
      hash: simpleHash(buyerId + listingId + Date.now()),
      timestamp: new Date().toISOString(),
      verified: true,
      status: 'confirmed'
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    return transaction;
  },

  getTransactions() {
    return JSON.parse(localStorage.getItem('transactions')) || [];
  },

  getTransactionsByUser(userId) {
    const transactions = this.getTransactions();
    return transactions.filter(t => t.buyerId === userId);
  }
};

// ========================================
// 7. UI UTILITIES
// ========================================

const UIUtils = {
  // Show toast notification
  showToast(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), duration);
  },

  // Show modal
  showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>${title}</h2>
        <p>${content}</p>
        <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
  },

  // Format date
  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }
};

// ========================================
// 8. PAGE INITIALIZATION
// ========================================

// Initialize system on page load
document.addEventListener('DOMContentLoaded', () => {
  AuthSystem.initUsers();
  
  // Check if user is logged in
  const currentUser = AuthSystem.getCurrentUser();
  
  // Redirect logic based on current page and auth status
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  if (currentPage === 'index.html') {
    // Landing/Login page
    if (currentUser) {
      if (currentUser.role === 'farmer') {
        window.location.href = 'farmer.html';
      } else if (currentUser.role === 'buyer') {
        window.location.href = 'buyer.html';
      }
    }
  } else if ((currentPage === 'farmer.html' || currentPage === 'buyer.html') && !currentUser) {
    // Ensure user is logged in for farmer/buyer pages
    window.location.href = 'index.html';
  }
});

// Export functions for use in HTML
window.AuthSystem = AuthSystem;
window.FarmerSystem = FarmerSystem;
window.UIUtils = UIUtils;
window.TransactionSystem = TransactionSystem;
window.sanitizeInput = sanitizeInput;