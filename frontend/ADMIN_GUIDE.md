# Admin System - Complete Setup Guide

## 🎯 Features Implemented

### ✅ Backend (Node.js + Express)
1. **Admin Controllers** (`adminController.js`)
   - Dashboard statistics (users, products, orders, revenue)
   - User management (view, update role, delete)
   - Sales reports by date
   - Top-selling products analysis
   - Category statistics

2. **Admin Utilities** (`utils/adminUtils.js`)
   - Role validation
   - Currency formatting
   - Date range calculations
   - Growth percentage calculations
   - Request validation helpers

3. **Admin Routes** (`routes/admin.js`)
   - `/api/admin/stats` - Dashboard statistics
   - `/api/admin/users` - User management
   - `/api/admin/users/:id/role` - Change user role
   - `/api/admin/users/:id` - Delete user
   - `/api/admin/reports/sales` - Sales report
   - `/api/admin/reports/top-products` - Top products
   - `/api/admin/reports/categories` - Category stats

### ✅ Frontend (React)

#### Layout Components
- **AdminLayout** - Main layout wrapper with sidebar and navbar
- **AdminSidebar** - Navigation menu with quick access
- **AdminNavbar** - Header with user info

#### Page Components
- **AdminDashboard** - Overview statistics and quick actions
- **AdminUsers** - User management with search and role updates
- **AdminProducts** - Product management with add/edit/delete
- **AdminOrders** - Order tracking with status updates
- **AdminReports** - Analytics and sales reports

#### UI Components
- **ProtectedRoute** - Admin-only route protection

---

## 🚀 Quick Start

### 1. Admin Login
```
Email: admin@nardos.com
Password: sami@2124
```

### 2. Access Admin Panel
After login, navigate to `/admin` or click "Admin Panel" in navbar

### 3. Available Admin Pages
- **Dashboard** - `/admin` - Overview and statistics
- **Users** - `/admin/users` - Manage users
- **Products** - `/admin/products` - Manage products
- **Orders** - `/admin/orders` - Track orders
- **Reports** - `/admin/reports` - View analytics

---

## 📊 Dashboard Overview

The admin dashboard displays:
- **Total Users** - Count of all registered users
- **Total Products** - Count of all products
- **Total Orders** - Count of all orders
- **Total Revenue** - Sum of all completed orders
- **Completed Orders** - Count of delivered orders

---

## 👥 User Management

### Features:
- **Search** - Find users by username or email
- **View** - See all user details
- **Change Role** - Promote user to admin or demote to user
- **Delete** - Remove user account

### User Roles:
- `user` - Regular customer
- `admin` - Administrator with full access

---

## 📦 Product Management

### Features:
- **View** - Browse all products
- **Add** - Create new product
  - Name, Brand, Category
  - Description, Price, Stock
  - Image URL
- **Edit** - Update product details (todo)
- **Delete** - Remove product
- **Search** - Find by name or brand

### Categories:
- Men
- Women
- Unisex
- Luxury / Men
- Luxury / Women
- Luxury / Unisex

---

## 🛒 Order Management

### Features:
- **View** - See all orders
- **Filter** - By status (pending, processing, shipped, delivered, cancelled)
- **Update Status** - Change order status
- **View Details** - See order items and customer info

### Order Statuses:
- `pending` - New order
- `processing` - Being prepared
- `shipped` - On the way
- `delivered` - Completed
- `cancelled` - Cancelled

---

## 📈 Analytics & Reports

### Available Reports:
1. **Sales by Date** - Revenue and order count per day
2. **Top Selling Products** - Best-performing products
3. **Category Statistics** - Products and avg price per category

---

## 🔧 API Endpoints (Admin Only)

All endpoints require:
- Valid JWT token
- Admin user role

### Get Dashboard Stats
```bash
GET /api/admin/stats
Authorization: Bearer <token>

Response:
{
  "totalUsers": 5,
  "totalProducts": 8,
  "totalOrders": 10,
  "totalRevenue": 2500.50,
  "completedOrders": 8
}
```

### Get All Users
```bash
GET /api/admin/users
Authorization: Bearer <token>

Response: [{ user objects }]
```

### Update User Role
```bash
PUT /api/admin/users/:id/role
Authorization: Bearer <token>
Body: { "role": "admin" }

Response: { "message": "User role updated", "user": {...} }
```

### Delete User
```bash
DELETE /api/admin/users/:id
Authorization: Bearer <token>

Response: { "message": "User deleted successfully" }
```

### Get Sales Report
```bash
GET /api/admin/reports/sales
Authorization: Bearer <token>

Response: [{ date, orderCount, totalSales }]
```

### Get Top Products
```bash
GET /api/admin/reports/top-products
Authorization: Bearer <token>

Response: [{ product, totalSold, totalRevenue }]
```

### Get Category Stats
```bash
GET /api/admin/reports/categories
Authorization: Bearer <token>

Response: [{ category, count, avgPrice }]
```

---

## 🎨 Styling

All admin components use:
- **Color Scheme**: Purple gradient (#667eea to #764ba2)
- **Responsive**: Mobile-friendly design
- **Tables**: Clean data presentation
- **Forms**: Modern input styling
- **Cards**: Shadow and hover effects

---

## 🔐 Security Features

1. **Protected Routes** - Only admins can access admin pages
2. **Token Validation** - All requests require JWT token
3. **Role Verification** - Backend checks user role
4. **Local Storage** - Safe credential storage
5. **Automatic Redirect** - Non-admins redirected to home

---

## 📱 Responsive Design

- **Desktop**: Full sidebar + content
- **Tablet**: Collapsible sidebar
- **Mobile**: Full-width with hamburger menu

---

## 🚀 Next Steps

1. **Customize Colors** - Edit color schemes in CSS files
2. **Add More Endpoints** - Extend admin functionality
3. **Implement Export** - Export reports to CSV/PDF
4. **Add Notifications** - Alert admin of orders/users
5. **Advanced Filters** - More filtering options in tables
6. **Charts** - Add visual analytics with Chart.js

---

## 📁 File Structure

```
frontend/src/
├── components/
│   ├── AdminLayout.jsx
│   ├── AdminLayout.css
│   ├── AdminSidebar.jsx
│   ├── AdminSidebar.css
│   ├── AdminNavbar.jsx
│   ├── AdminNavbar.css
│   ├── AdminDashboard.jsx
│   ├── AdminDashboard.css
│   ├── AdminUsers.jsx
│   ├── AdminUsers.css
│   ├── AdminProducts.jsx
│   ├── AdminProducts.css
│   ├── AdminOrders.jsx
│   ├── AdminOrders.css
│   ├── AdminReports.jsx
│   ├── AdminReports.css
│   └── ProtectedRoute.jsx
├── pages/
│   ├── AdminDashboardPage.jsx
│   ├── AdminUsersPage.jsx
│   ├── AdminProductsPage.jsx
│   ├── AdminOrdersPage.jsx
│   └── AdminReportsPage.jsx
└── App.jsx (updated with admin routes)

backend/
├── controllers/
│   └── adminController.js
├── routes/
│   └── admin.js
├── utils/
│   └── adminUtils.js
└── server.js (admin routes included)
```

---

## ✅ Testing Checklist

- [ ] Admin login works
- [ ] Dashboard loads stats
- [ ] Users can be searched and filtered
- [ ] User roles can be updated
- [ ] Products can be added
- [ ] Products can be deleted
- [ ] Orders can be filtered by status
- [ ] Order status can be updated
- [ ] Reports load correctly
- [ ] Sidebar navigation works
- [ ] Responsive design works on mobile
- [ ] Logout functionality works

---

**Admin system is fully operational! 🎉**
