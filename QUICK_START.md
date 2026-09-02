# 🚀 Quick Start Guide - Nardos Perfume E-Commerce

## ⚡ Get Started in 3 Minutes

### 1️⃣ Start the Backend

**Terminal 1:**
```bash
cd c:\nardos\backend
npm run dev
```

✅ You should see: `Server running on port 5000`

### 2️⃣ Start the Frontend

**Terminal 2:**
```bash
cd c:\nardos\frontend
npm run dev
```

✅ You should see: `Local: http://localhost:5173`

### 3️⃣ Open in Browser

Visit: **http://localhost:5173**

---

## 🧪 Test the Connection

### Quick Test (30 seconds)

1. Click **"REGISTER"** at top
2. Fill form and create account
3. You're automatically logged in ✅
4. Click **"PERFUMES"** to see products from backend ✅

### Done! 🎉

---

## 📱 Available Pages

| Page | URL | Status |
|------|-----|--------|
| Home | `/` | ✅ Ready |
| Perfumes (Products) | `/perfumes` | ✅ Connected |
| Register | `/register` | ✅ Connected |
| Login | `/login` | ✅ Connected |
| Search | `/search` | ✅ Connected |
| Product Details | `/product/:id` | 🔄 Ready |
| Cart | `/cart` | 🔄 Ready |
| Checkout | `/checkout` | 🔄 Ready |
| Admin | `/admin` | 🔄 Ready |

---

## 🔑 Test Account

After registering, you can login with:
- **Email:** test@example.com
- **Password:** password123

---

## 🐛 Something Not Working?

### Backend won't start?
```bash
# Make sure MongoDB is running
# Or change connection string in backend/.env to MongoDB Atlas
```

### Frontend shows "Failed to fetch"?
- Check backend terminal - is it running on port 5000?
- Refresh browser page

### Styles look broken?
```bash
# Rebuild frontend
cd c:\nardos\frontend
npm run build
```

---

## 📋 What's Connected

✅ **Working:**
- User Registration & Login
- Products List (fetches from API)
- Authentication (JWT + tokens)
- User Navigation (Navbar shows login status)
- Search functionality

🔄 **Ready to Connect:**
- Shopping Cart
- Orders & Checkout
- Admin Dashboard

---

## 💡 Pro Tips

1. **Check Network Tab (F12)** to see API calls
2. **Check Console (F12)** for error messages
3. **Clear Browser Cache** if styles look wrong
4. **Restart Backend** if you get connection errors

---

## 📚 Full Documentation

For detailed setup and API reference, see:
- [`CONNECTION_GUIDE.md`](./CONNECTION_GUIDE.md) – Complete integration guide
- [`TESTING_CHECKLIST.md`](./TESTING_CHECKLIST.md) – Test all features

---

## 🎯 Next Features to Connect

1. **Connect Cart** – Save shopping cart to backend
2. **Connect Checkout** – Create orders from cart
3. **Admin Dashboard** – View statistics and manage products

---

**That's it! Happy testing! 🎉**

Questions? Check the logs in both terminals for errors.
