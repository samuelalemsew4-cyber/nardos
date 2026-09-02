# 🔐 Admin Access Guide - Troubleshooting & Setup

## ✅ Admin Credentials

```
📧 Email:    admin@nardos.com
🔑 Password: sami@2124
👤 Username: samuel
🎯 Role:     admin
```

---

## 🌐 Admin Access URLs

### Frontend Admin Panel
```
http://localhost:5175/admin                  → Admin Login
http://localhost:5175/admin/dashboard        → Dashboard (after login)
http://localhost:5175/admin/users            → User Management
http://localhost:5175/admin/products         → Product Management
http://localhost:5175/admin/orders           → Order Management
http://localhost:5175/admin/reports          → Reports & Analytics
```

### API Endpoints (Backend)
```
http://localhost:5000/api/admin/stats        → Dashboard Stats
http://localhost:5000/api/admin/users        → User List
http://localhost:5000/api/auth/login         → Login Endpoint
```

---

## 🚀 Access Admin Dashboard

### Step 1: Ensure Backend is Running
```bash
cd C:\nardos\backend
npm run dev
```
**Expected output:**
```
🚀 Server started on port 5000
✅ MongoDB connected successfully
```

### Step 2: Ensure Frontend is Running
```bash
cd C:\nardos\frontend
npm run dev
```
**Expected output:**
```
VITE v4.5.14 ready at http://localhost:5175
```

### Step 3: Database Seeding
```bash
cd C:\nardos\backend
node seed.js
```
**Expected output:**
```
✅ Database seeded successfully!
Sample Users:
  Admin: admin@nardos.com / sami@2124
```

### Step 4: Login to Admin
1. Navigate to `http://localhost:5175`
2. Click the **⚙️ (Settings)** icon in the top navbar
3. Enter credentials:
   - **Email:** `admin@nardos.com`
   - **Password:** `sami@2124`
4. Click **Login**

---

## ✅ Verify Admin Setup

### Verify via API (PowerShell)

```powershell
# Step 1: Login and get token
$body = @{
    email = "admin@nardos.com"
    password = "sami@2124"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing

$data = $response.Content | ConvertFrom-Json
$token = $data.token

Write-Host "✅ Login Successful!"
Write-Host "Token: $($token.Substring(0, 20))..."
Write-Host "User Role: $($data.user.role)"

# Step 2: Verify admin stats endpoint
$headers = @{ "Authorization" = "Bearer $token" }
$stats = Invoke-WebRequest -Uri "http://localhost:5000/api/admin/stats" `
    -Headers $headers `
    -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json

Write-Host "✅ Admin Access Verified!"
Write-Host "Total Products: $($stats.totalProducts)"
Write-Host "Total Users: $($stats.totalUsers)"
```

---

## 🔧 Troubleshooting

### Issue 1: "This account does not have admin access"

**Cause:** Admin user exists but role is not 'admin'

**Solution:**
```bash
# Reseed the database
cd C:\nardos\backend
node seed.js
```

**Or manually update user role via API:**
```powershell
# Get your user ID first, then update it
$token = "YOUR_JWT_TOKEN"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{ role = "admin" } | ConvertTo-Json
$userId = "USER_ID_HERE"

Invoke-WebRequest -Uri "http://localhost:5000/api/admin/users/$userId/role" `
    -Method PUT `
    -Headers $headers `
    -Body $body
```

### Issue 2: "Invalid email or password"

**Cause:** Admin user doesn't exist in database

**Solution:**
```bash
# Run seed script to create admin user
cd C:\nardos\backend
node seed.js
```

**Or manually register admin:**
```powershell
$body = @{
    username = "samuel"
    email = "admin@nardos.com"
    password = "sami@2124"
    firstName = "Admin"
    lastName = "User"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing
```

### Issue 3: "Cannot connect to backend"

**Cause:** Backend server not running or wrong port

**Solution:**
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill any process on port 5000
taskkill /PID <PID> /F

# Start backend fresh
cd C:\nardos\backend
npm run dev
```

### Issue 4: Frontend not loading

**Cause:** Frontend dev server not running

**Solution:**
```bash
cd C:\nardos\frontend
npm run dev

# Should output: ➜  Local:   http://localhost:5175/
```

---

## 📋 Admin Features Available

After successful login, access these features:

### 1. Dashboard 📊
- View real-time statistics
- See user count, product count, orders, revenue
- Quick action buttons

### 2. Users 👥
- View all registered users
- Search by username/email
- Change user roles (user ↔ admin)
- Delete user accounts

### 3. Products 📦
- View all products with images
- Add new products
- Delete products
- Update product details
- Filter by category

### 4. Orders 🛒
- View all customer orders
- Filter by order status
- Update order status
- Track order details

### 5. Reports 📈
- Sales by date
- Top-selling products
- Category statistics
- Revenue analysis

---

## 🎯 Quick Start Commands

### Complete Setup (All in One)
```bash
# Terminal 1 - Backend
cd C:\nardos\backend
npm install
npm run dev

# Terminal 2 - Seed Database
cd C:\nardos\backend
node seed.js

# Terminal 3 - Frontend
cd C:\nardos\frontend
npm install
npm run dev

# Then open browser
# http://localhost:5175/admin
```

---

## 📁 Related Files

| File | Purpose |
|------|---------|
| `backend/controllers/authController.js` | Authentication logic |
| `backend/models/User.js` | User schema with role field |
| `frontend/pages/Admin.jsx` | Admin login page |
| `frontend/components/ProtectedRoute.jsx` | Admin route protection |
| `backend/seed.js` | Database initialization |

---

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5175
- [ ] Database seeded with admin user
- [ ] Can access `/admin` login page
- [ ] Can login with credentials
- [ ] Can access admin dashboard
- [ ] Can view products
- [ ] Can add/delete products
- [ ] Can view users
- [ ] Can view orders

---

## 🎓 Admin Dashboard Tutorial

### After Login, You Can:

**1. Add Products**
- Go to Products section
- Click "Add Product"
- Fill in details:
  - Name (e.g., "Lavender Dream")
  - Brand (e.g., "Nardos Essence")
  - Category (Select from dropdown)
  - Description
  - Price
  - Stock quantity
  - Image URL
- Click "Add Product"

**2. Manage Users**
- Go to Users section
- Search for specific users
- Click role dropdown to change user roles
- Click delete to remove users

**3. Track Orders**
- Go to Orders section
- Filter by status (pending, processing, shipped, etc.)
- Click dropdown to change order status
- View order details

**4. View Reports**
- Go to Reports section
- See sales by date
- View top-selling products
- Check category statistics

---

## 🔒 Security Features

✅ JWT token-based authentication
✅ Role-based access control
✅ Admin-only routes protected
✅ Secure password hashing (bcryptjs)
✅ Token expires in 7 days
✅ Authorization headers required for API calls

---

## 📞 Support

If you encounter issues:

1. **Check backend logs** - Look for error messages in terminal
2. **Verify credentials** - Ensure email/password are correct
3. **Reseed database** - Run `node seed.js` again
4. **Clear browser cache** - Ctrl+Shift+Delete in browser
5. **Check network** - Ensure backend is accessible

---

**Your admin system is ready! 🚀**
