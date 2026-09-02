const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Environment variables-ን ለማንበብ
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// 1. Middlewares
app.use(express.json()); // JSON data ለመቀበል
app.use(cors()); // ለተለያዩ origins ግንኙነት እንዲፈቅድ
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Database Connection
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
    throw new Error('MONGODB_URI is required. The backend only runs with MongoDB configured.');
}

// 3. Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const searchRoutes = require('./routes/search');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');

// 4. Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Nardos Luxury Perfume Backend API is running!' });
});

app.get('/api', (req, res) => {
    res.json({ 
        message: 'Welcome to Nardos API',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            cart: '/api/cart',
            orders: '/api/orders',
            search: '/api/search',
            admin: '/api/admin',
            contact: '/api/contact'
        }
    });
});

// 5. Server Port
const PORT = process.env.PORT || 5000;

mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
    dbName: process.env.MONGODB_DB_NAME
})
    .then(() => {
        console.log('✅ MongoDB በሰላም ተገናኝቷል!');
        app.listen(PORT, () => {
            console.log(`🚀 ሰርቨሩ በ port ${PORT} ላይ ተነስቷል`);
        });
    })
    .catch((err) => {
        console.error('⚠️ MongoDB connection failed. Backend stopped:', err.message);
        process.exit(1);
    });