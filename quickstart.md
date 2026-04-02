# 🚀 AgroLink - Quick Start Guide

## 30-Second Setup

1. **Open `index.html` in your browser** (Chrome, Firefox, Safari, Edge)
2. **That's it!** No installation, no server, no setup required.

---

## 5-Minute Demo

### Step 1: Create Farmer Account (2 minutes)
```
1. Click "Create Account"
2. Select "Farmer" role
3. Fill in:
   - Name: Ramesh Kumar
   - Email: ramesh@farm.com
   - Password: Ramesh@123
4. Click "Create Account"
5. Sign in with those credentials
```

### Step 2: Create a Listing (2 minutes)
```
1. You're now on Farmer Dashboard
2. Click image upload area and select a photo
3. Fill form:
   - Crop Name: Tomato
   - Quantity: 100
   - Price: 20
   - Location: Mysore, Karnataka
   - Contact: 98765 43210
   - Description: Fresh, organic tomatoes
   - Status: Ready to Sell
4. Click "Create Listing"
5. See your listing appear!
```

### Step 3: Switch to Buyer (1 minute)
```
1. Logout (top right button)
2. Create new account as Buyer:
   - Name: Priya Singh
   - Email: priya@buyer.com
   - Password: Priya@123
   - Role: Buyer
3. Login with buyer account
```

### Step 4: Interact as Buyer (Bonus!)
```
1. You see farmer feed
2. Click ❤️ Like on tomato listing
3. Click 📞 Contact → send message
4. Click 🔗 Share → shares to clipboard
5. Check Security Dashboard for verification
6. Check Transaction History
```

---

## User Roles & Permissions

### 👨‍🌾 Farmer
- ✅ Create crop listings
- ✅ Upload images
- ✅ View active listings
- ✅ Track likes and interactions
-  ✅ View security dashboard
- ✅ View activity history
- ❌ Cannot see buyer feed

### 👤 Buyer
- ✅ View farmer listings
- ✅ Search & filter crops
- ✅ Like/favorite listings
- ✅ Share listings
- ✅ Contact farmers
- ✅ View transaction history
- ✅ View security dashboard
- ❌ Cannot create listings

---

## Feature Walkthrough

### 1. Authentication
**Landing Page (index.html)**
- Login form for existing users
- Register form for new accounts
- Role selection during registration
- Features overview

### 2. Farmer Dashboard (farmer.html)
**Components:**
- Stats: Active listings, total likes, interactions, verified badge
- Image upload with preview
- Listing form with all details
- Display of your active listings
- Security dashboard with login history
- Activity history log

**What You Can Do:**
- Create unlimited listings
- Track how many likes each crop gets
- See who contacted you
- Monitor login attempts
- Check suspicious activities

### 3. Buyer Feed (buyer.html)
**Components:**
- Social media-style listing cards
- Search by crop name
- Filter by status (Ready/Growing/Seasonal)
- Sort by most popular (most likes)
- Like, share, and contact buttons
- Statistics dashboard
- Favorite farmers tracking
- Transaction history with blockchain verification

**What You Can Do:**
- Browse fresh crops from verified farmers
- Search specific crops
- Like your favorites
- Share with friends
- Message farmers directly
- View all your interactions verified with hashes
- Check who contacted you

### 4. Security Dashboard
**Available on both Farmer & Buyer pages**
- JWT Token status
- Data encryption status
- Rate limiting status
- Login history (last 10)
- Suspicious activities alerts

---

## Data Storage

All data stored locally in your browser (LocalStorage):
- Users & passwords (hashed)
- Listings with Base64 images
- Activity history
- Login logs
- Transaction hashes

**Data is cleared when you:**
- Clear browser cache
- Open in private/incognito mode
- Uninstall browser

**Data persists when you:**
- Close and reopen browser
- Navigate between pages
- Refresh the page

---

## Test Scenarios

### Scenario 1: Two-User Demo
```
User 1 (Farmer):
- Email: farmer1@test.com
- Password: Test@123
- Listings: Tomato, Wheat, Rice

User 2 (Buyer):
- Email: buyer1@test.com
- Password: Test@123
- Likes: All farmer1 listings
```

### Scenario 2: Security Testing
```
1. Try wrong password 6 times
   → Rate limiting locks your account
   → Wait 15 minutes and try again

2. Check Security Dashboard
   → See all failed attempts logged
   → See them flagged as suspicious

3. Create listing as farmer
   → Check transaction hash
   → Try to modify and see hash changes
```

### Scenario 3: Image Upload
```
1. Select any image file
   → Image preview appears
   → Can be up to 5MB
   → Auto-converted to Base64

2. Submit listing
   → Image stored with listing
   → Image displays in feed
   → Base64 shown in developer tools
```

---

## Keyboard Shortcuts & Tips

### Global
- <kbd>Tab</kbd> - Navigate between fields
- <kbd>Enter</kbd> - Submit form
- <kbd>Escape</kbd> - Close modals

### Tips
- 💡 Use Chrome DevTools (F12) → Application → LocalStorage to see all data
- 💡 Open multiple browser windows to test farmer + buyer simultaneously
- 💡 Images are stored as Base64 in localStorage (you'll see `data:image/...`)
- 💡 Transaction hashes are unique per interaction (try liking same listing twice)
- 💡 Logout clears your session token but keeps data in localStorage

---

## Common Questions

**Q: Where is my data stored?**
A: In your browser's LocalStorage (client-side only). Check DevTools → Application → LocalStorage

**Q: Can I export my data?**
A: Yes, copy from LocalStorage and paste in a text editor

**Q: Can multiple people use this at the same time?**
A: Yes, in different browsers or incognito windows

**Q: What if I reload the page?**
A: All data persists! You'll still be logged in (unless token expired after 7 days)

**Q: Can I delete my data?**
A: Yes, clear browser cache or open Settings → Clear Browsing Data → LocalStorage

**Q: Is this production-ready?**
A: It's a full-featured MVP! For production, integrate with Supabase/Firebase backend

**Q: Why does my image not display?**
A: Large images take longer to process. Wait a moment for Base64 conversion.

**Q: Does this work offline?**
A: Yes! Everything works offline (no internet needed)

---

## Troubleshooting

### Login Issues
```
❌ "Invalid email or password"
✅ Solutions:
   - Create account first if you're new
   - Check email spelling
   - Verify password (case-sensitive!)
   - Try resetting: Clear cache and create new account

❌ "Too many login attempts"
✅ Solutions:
   - Wait 15 minutes (rate limiting)
   - Or clear browser cache
```

### Image Upload Issues
```
❌ Image not showing
✅ Solutions:
   - Ensure file is a valid image (PNG, JPG, GIF)
   - File size < 5MB
   - Click preview area to select file
   - Wait for Base64 conversion

❌ "Image is too large"
✅ Solutions:
   - Compress image using online tool
   - Or resize image to max 5MB
```

### Feed/Listing Issues
```
❌ Can't see my listings
✅ Solutions:
   - Login as the farmer who created them
   - Check if you're on farmer.html, not buyer.html

❌ No listings showing in buyer feed
✅ Solutions:
   - Create listings as farmer first
   - Logout and login as buyer
   - Refresh the page
```

### Data/Storage Issues
```
❌ Data disappeared after closing browser
✅ Solutions:
   - Check if you cleared cache
   - Open browser again (data should persist)
   - Check private/incognito mode (data cleared on close)

❌ localStorage full
✅ Solutions:
   - Clear cache
   - Or remove old listings (not in this MVP)
   - Upgrade to cloud storage (Supabase)
```

---

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full support |
| Firefox | 88+     | ✅ Full support |
| Safari  | 14+     | ✅ Full support |
| Edge    | 90+     | ✅ Full support |
| Mobile Chrome | Latest | ✅ Full support |
| Mobile Safari | Latest | ✅ Full support |

---

## What's Stored in LocalStorage?

```javascript
// Open browser console (F12) and run:
Object.keys(localStorage)

// Returns:
[
  "users",                    // All registered users
  "currentUser",              // Currently logged-in user
  "authToken",                // JWT token
  "farmerListings",           // All farmer listings
  "farmerHistory",            // Listing creation history
  "transactions",             // All interactions
  "likedListings",            // Buyer's favorites
  "loginLogs",                // Login attempts
  "rateLimit_email@test.com"  // Rate limit tracker
]

// View specific data:
JSON.parse(localStorage.getItem('users'))
JSON.parse(localStorage.getItem('farmerListings'))
// etc.
```

---

## API Endpoints (Javascript Functions)

```javascript
// Authentication
AuthSystem.register(name, email, password, role)
AuthSystem.login(email, password)
AuthSystem.logout()
AuthSystem.getCurrentUser()
AuthSystem.isAuthenticated()

// Farmers
FarmerSystem.addListing(cropName, cropImage, location, status)
FarmerSystem.getAllListings()
FarmerSystem.getUserListings(userId)
FarmerSystem.likeListing(listingId)

// Transactions
TransactionSystem.recordInteraction(buyerId, listingId, type)
TransactionSystem.getTransactions()

// Utilities
UIUtils.showToast(message, type)
UIUtils.formatDate(dateString)
sanitizeInput(input)
```

---

## Next Steps

1. **Explore the Code**
   - Read comments in script.js
   - Review CSS structure
   - Understand data flow

2. **Test All Features**
   - Create multiple accounts
   - Upload various images
   - Test security features
   - Check all filters

3. **Customize**
   - Change colors in CSS
   - Add new fields to forms
   - Modify validation rules
   - Add new features

4. **Deploy**
   - Host on GitHub Pages
   - Deploy to Netlify
   - Put on any static hosting

5. **Upgrade**
   - Integrate Supabase
   - Add payment system
   - Build mobile app
   - Deploy to production

---

**Enjoy AgroLink! Happy farming! 🌾**

*Questions? Read README.md for detailed documentation*