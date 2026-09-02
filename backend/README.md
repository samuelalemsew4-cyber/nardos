# Nardos Luxury Perfume E-commerce Backend

Node.js + Express + MongoDB backend for the Nardos Luxury Perfume e-commerce platform.

## Features

- **User Authentication** (Register, Login, Profile Management)
- **Product Management** (CRUD operations for admin)
- **Shopping Cart** (Add, update, remove items)
- **Orders** (Create, track, manage orders)
- **Admin Dashboard** (Statistics, user management, order management)
- **Search & Filter** (Find perfumes by name, brand, category, price)
- **Payment Methods** (Telebirr, CBE, Abay, e-Mpesa)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nardos
JWT_SECRET=nardos_perfume_secret_key_2024
JWT_EXPIRE=7d
NODE_ENV=development
```

3. Start the server:
```bash
npm run dev  # Development with nodemon
npm start    # Production
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `PUT /api/auth/profile` - Update profile (requires token)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user cart (requires token)
- `POST /api/cart/add` - Add item to cart (requires token)
- `PUT /api/cart/update/:productId` - Update cart item (requires token)
- `DELETE /api/cart/remove/:productId` - Remove from cart (requires token)
- `DELETE /api/cart/clear` - Clear cart (requires token)

### Orders
- `GET /api/orders` - Get user orders (requires token)
- `GET /api/orders/:id` - Get single order (requires token)
- `POST /api/orders` - Create order (requires token)
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Search
- `GET /api/search?q=perfume&category=Men&minPrice=5000&maxPrice=25000&sort=price-low`

### Admin
- `GET /api/admin/stats` - Get dashboard stats (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/orders` - Get all orders (admin only)
- `PUT /api/admin/orders/:id/status` - Update order status (admin only)
- `GET /api/admin/products` - Get all products (admin only)
- `POST /api/admin/products` - Create product (admin only)
- `PUT /api/admin/products/:id` - Update product (admin only)
- `DELETE /api/admin/products/:id` - Delete product (admin only)

## Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Database Models

### User
- username, email, password
- firstName, lastName, phone
- address, city, country
- role (user, admin)

### Product
- name, brand, category
- description, price, image
- stock, rating, reviews
- createdAt, updatedAt

### Order
- orderNumber, user, items
- totalPrice, tax, shippingCost
- paymentMethod, paymentStatus, orderStatus
- shippingAddress, createdAt, updatedAt

### Cart
- user, items
- totalPrice, createdAt, updatedAt

## Example Usage

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Search Perfumes
```bash
curl 'http://localhost:5000/api/search?q=Dior&category=Men&sort=price-low'
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name "nardos-backend"
```

3. Use MongoDB Atlas for cloud database
4. Set up nginx or Apache as reverse proxy
5. Configure SSL certificate

## License

ISC
