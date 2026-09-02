# Frontend-Backend Integration Testing Checklist

## ✅ Pre-Testing Setup

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] Browser DevTools open (F12) - Console tab active
- [ ] MongoDB connected (check backend logs)
- [ ] No errors in backend terminal

## 🧪 Test 1: User Registration

**Path:** http://localhost:5173/register

Steps:
- [ ] Fill in registration form:
  - Username: `testuser123`
  - First Name: `Test`
  - Last Name: `User`
  - Email: `test@example.com`
  - Password: `password123`
  - Confirm: `password123`
- [ ] Click "SIGN UP" button
- [ ] Check Network tab - POST to `/api/auth/register` succeeds
- [ ] User automatically logs in
- [ ] Redirected to home page
- [ ] Navbar shows "Hello, Test User!" with logout button

**Expected Error Handling:**
- [ ] Duplicate email shows error message
- [ ] Passwords don't match shows error
- [ ] Weak password shows indicator

## 🧪 Test 2: User Login

**Path:** http://localhost:5173/login

Steps:
- [ ] First logout if already logged in
- [ ] Click "SIGN IN" button
- [ ] Enter email: `test@example.com`
- [ ] Enter password: `password123`
- [ ] Click "SIGN IN"
- [ ] Check Network tab - POST to `/api/auth/login` succeeds
- [ ] Token stored in localStorage (DevTools > Application > Storage > LocalStorage)
- [ ] Redirected to home
- [ ] Navbar shows user greeting

**Expected Error Handling:**
- [ ] Wrong password shows error
- [ ] Non-existent email shows error
- [ ] Empty fields show validation error

## 🧪 Test 3: View Products

**Path:** http://localhost:5173/perfumes

Steps:
- [ ] Page loads without errors
- [ ] Products displayed in grid
- [ ] Check Network tab - GET `/api/products` succeeds
- [ ] Product count matches backend data
- [ ] Each product shows: name, brand, price
- [ ] Click product to view details

**Expected Behavior:**
- [ ] Loading state shows while fetching
- [ ] If API fails, fallback mock data displays
- [ ] Prices formatted with "ETB" suffix

## 🧪 Test 4: Product Search

**Path:** http://localhost:5173/search

Steps:
- [ ] Type in search box: `Oud`
- [ ] Results filter in real-time
- [ ] Try category filter
- [ ] Try price range filter
- [ ] Check Network tab for `/api/search` calls

**Expected Behavior:**
- [ ] Search works on product name/brand/category
- [ ] Filters combine correctly
- [ ] Empty results show "No products found"

## 🧪 Test 5: Logout

**Path:** Any page (look at Navbar)

Steps:
- [ ] Click "LOGOUT" button in navbar
- [ ] Check localStorage is cleared
- [ ] Redirected to home page
- [ ] Navbar shows "LOGIN" link
- [ ] Try accessing protected page → redirected to login

## 🧪 Test 6: Protected Routes

Steps:
- [ ] Logout completely
- [ ] Try accessing `/cart` directly
- [ ] Should redirect to `/login`
- [ ] Login again
- [ ] Access `/cart` works

## 🧪 Test 7: Token Expiration (Optional)

To manually test token expiration:

1. Logout
2. Login again
3. In DevTools Console, run:
   ```javascript
   localStorage.removeItem('token');
   ```
4. Try using the app
5. Should redirect to login

## 📊 Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| Registration | ✅/❌ | |
| Login | ✅/❌ | |
| View Products | ✅/❌ | |
| Search | ✅/❌ | |
| Logout | ✅/❌ | |
| Protected Routes | ✅/❌ | |

## 🐛 Troubleshooting

### Backend Connection Failed
**Error:** "Failed to fetch" or "Network error"
**Solution:**
- Verify backend running: `npm run dev` in backend folder
- Check port 5000 is not blocked
- Restart backend

### CORS Errors
**Error:** "Access to XMLHttpRequest blocked by CORS policy"
**Solution:**
- Ensure backend has CORS middleware
- Restart backend

### Token Not Persisting
**Error:** Logged out after refresh
**Solution:**
- Check localStorage in DevTools
- Verify JWT_SECRET in backend .env

### Product Not Showing
**Error:** Blank products list or "Loading..." forever
**Solution:**
- Check MongoDB connection
- Verify `/api/products` endpoint
- Check backend logs for errors

## 📝 Notes for Next Steps

**After passing all tests:**
1. Connect Cart page to backend
2. Connect Checkout/Orders to backend
3. Test full purchase flow
4. Setup admin dashboard
5. Configure payment gateway

## Command Reference

**Start Backend:**
```bash
cd c:\nardos\backend && npm run dev
```

**Start Frontend:**
```bash
cd c:\nardos\frontend && npm run dev
```

**Build Frontend:**
```bash
cd c:\nardos\frontend && npm run build
```

**Check Backend Logs:**
- Look at terminal where `npm run dev` is running
- Should see requests like: `GET /api/products`

**Debug Frontend:**
- DevTools Console (F12)
- Network tab to see API calls
- Application > Storage > LocalStorage for token

---

✅ **All tests passing = Backend-Frontend integration working!**
