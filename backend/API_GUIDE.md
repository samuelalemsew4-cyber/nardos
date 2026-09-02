# Nardos Backend API Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally or Atlas)
- npm or yarn

### Installation

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file** (already exists, verify these variables):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/nardos
   JWT_SECRET=nardos_perfume_secret_key_2024
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start the server:**
   ```bash
   npm run dev      # With nodemon (development)
   npm start        # Direct node (production)
   ```

Server will run on `http://localhost:5000`

---

## 📚 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```

- `POST /login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "secure123"
  }
  ```

- `GET /profile` - Get user profile (requires auth token)
- `PUT /profile` - Update user profile (requires auth token)

### Products (`/api/products`)
- `GET /` - Get all products (with filters)
  - Query params: `category`, `minPrice`, `maxPrice`, `search`
- `GET /:id` - Get single product
- `POST /` - Create product (admin only)
- `PUT /:id` - Update product (admin only)
- `DELETE /:id` - Delete product (admin only)
- `POST /:id/review` - Add review (requires auth)

### Cart (`/api/cart`)
- `GET /` - Get user cart (requires auth)
- `POST /add` - Add item to cart (requires auth)
  ```json
  {
    "productId": "product_id",
    "quantity": 1
  }
  ```
- `PUT /update/:productId` - Update cart item (requires auth)
- `DELETE /remove/:productId` - Remove from cart (requires auth)
- `DELETE /clear` - Clear cart (requires auth)

### Orders (`/api/orders`)
- `GET /` - Get user orders (requires auth)
- `GET /:id` - Get order details (requires auth)
- `POST /` - Create order from cart (requires auth)
  ```json
  {
    "shippingAddress": "123 Main St",
    "paymentMethod": "Telebirr"
  }
  ```
- `PUT /:id/cancel` - Cancel order (requires auth)
- `GET /all` - Get all orders (admin only)
- `PUT /:id/status` - Update order status (admin only)

### Search (`/api/search`)
- `GET /` - Search products
  - Query params: `q`, `category`, `minPrice`, `maxPrice`, `sort`

### Admin (`/api/admin`)
- `GET /stats` - Dashboard statistics (admin only)
- `GET /users` - Get all users (admin only)
- `PUT /users/:id/role` - Update user role (admin only)
- `DELETE /users/:id` - Delete user (admin only)
- `GET /reports/sales` - Sales report (admin only)
- `GET /reports/top-products` - Top products (admin only)
- `GET /reports/categories` - Category statistics (admin only)

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Token is returned after successful login/register.

---

## 📁 Project Structure

```
backend/
├── controllers/           # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── adminController.js
├── models/               # MongoDB schemas
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── routes/              # API routes
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   ├── orders.js
│   ├── search.js
│   └── admin.js
├── middleware/          # Custom middleware
│   └── auth.js
├── server.js            # Main server file
├── package.json
├── .env                 # Environment variables
└── README.md
```

---

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 5000 | Server port |
| MONGODB_URI | mongodb://localhost:27017/nardos | MongoDB connection |
| JWT_SECRET | nardos_perfume_secret_key_2024 | JWT signing key |
| JWT_EXPIRE | 7d | Token expiration time |
| NODE_ENV | development | Environment (development/production) |

---

## 💡 Tips

- Use Postman or Thunder Client to test API endpoints
- All dates are in ISO 8601 format
- Price values are in the base currency unit
- Tax calculation: 15% on order subtotal

---

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod` (local) or check Atlas connection string
- Verify MONGODB_URI in .env

**Port Already in Use:**
- Change PORT in .env or kill process using port 5000

**JWT Token Invalid:**
- Ensure token is included in Authorization header
- Token format: `Bearer <token>`
- Check JWT_SECRET matches in .env

---

## 📝 Notes

- Register/Login endpoints don't require authentication
- All admin endpoints require both auth token AND admin role
- Cart is unique per user
- Products can be filtered by category, price range, or search query

For detailed API testing, refer to API documentation or use Postman collection.
