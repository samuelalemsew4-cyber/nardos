const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error('MONGODB_URI is required. Seed data must be written to the configured MongoDB database.');
}

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, { dbName: process.env.MONGODB_DB_NAME });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});

    // Create sample users
    console.log('Creating sample users...');
    const adminPassword = await bcrypt.hash('sami@2124', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const admin = await User.create({
      username: 'samuel',
      email: 'admin@nardos.com',
      password: adminPassword,
      firstName: 'Samuel',
      lastName: 'Admin',
      phone: '+251911234567',
      role: 'admin'
    });

    const user1 = await User.create({
      username: 'customer1',
      email: 'customer1@nardos.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+251911234568',
      address: '123 Main St',
      city: 'Addis Ababa',
      country: 'Ethiopia'
    });

    const user2 = await User.create({
      username: 'customer2',
      email: 'customer2@nardos.com',
      password: userPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+251911234569',
      address: '456 Oak Ave',
      city: 'Dire Dawa',
      country: 'Ethiopia'
    });

    console.log('✅ Users created');

    // Create sample products
    console.log('Creating sample products...');
    const products = await Product.create([
      {
        name: 'Essence de Luxe',
        brand: 'Nardos',
        category: 'Luxury / Women',
        description: 'Premium women\'s fragrance with notes of rose and jasmine',
        price: 299.99,
        image: 'https://via.placeholder.com/300x400?text=Essence+de+Luxe',
        stock: 50,
        rating: 4.8
      },
      {
        name: 'Royal Oud',
        brand: 'Nardos',
        category: 'Luxury / Men',
        description: 'Sophisticated men\'s fragrance with oud and sandalwood',
        price: 349.99,
        image: 'https://via.placeholder.com/300x400?text=Royal+Oud',
        stock: 35,
        rating: 4.9
      },
      {
        name: 'Bloom & Grace',
        brand: 'Nardos',
        category: 'Women',
        description: 'Floral fragrance perfect for everyday wear',
        price: 89.99,
        image: 'https://via.placeholder.com/300x400?text=Bloom+Grace',
        stock: 100,
        rating: 4.6
      },
      {
        name: 'Midnight Mystery',
        brand: 'Nardos',
        category: 'Men',
        description: 'Dark and mysterious scent for evening occasions',
        price: 79.99,
        image: 'https://via.placeholder.com/300x400?text=Midnight+Mystery',
        stock: 60,
        rating: 4.5
      },
      {
        name: 'Unisex Harmony',
        brand: 'Nardos',
        category: 'Unisex',
        description: 'Balanced fragrance suitable for all genders',
        price: 99.99,
        image: 'https://via.placeholder.com/300x400?text=Unisex+Harmony',
        stock: 75,
        rating: 4.7
      },
      {
        name: 'Tropical Breeze',
        brand: 'Nardos',
        category: 'Women',
        description: 'Light and fresh tropical fragrance',
        price: 69.99,
        image: 'https://via.placeholder.com/300x400?text=Tropical+Breeze',
        stock: 90,
        rating: 4.4
      },
      {
        name: 'Executive Power',
        brand: 'Nardos',
        category: 'Men',
        description: 'Professional fragrance for business settings',
        price: 84.99,
        image: 'https://via.placeholder.com/300x400?text=Executive+Power',
        stock: 55,
        rating: 4.6
      },
      {
        name: 'Luxury / Unisex Gold',
        brand: 'Nardos',
        category: 'Luxury / Unisex',
        description: 'Precious blend with gold accents',
        price: 399.99,
        image: 'https://via.placeholder.com/300x400?text=Gold+Luxury',
        stock: 20,
        rating: 4.9
      }
    ]);

    console.log('✅ Products created');

    // Create sample carts
    console.log('Creating sample carts...');
    await Cart.create([
      {
        user: user1._id,
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            price: products[0].price,
            quantity: 1,
            image: products[0].image
          }
        ],
        total: products[0].price
      },
      {
        user: user2._id,
        items: [
          {
            product: products[1]._id,
            name: products[1].name,
            price: products[1].price,
            quantity: 2,
            image: products[1].image
          },
          {
            product: products[2]._id,
            name: products[2].name,
            price: products[2].price,
            quantity: 1,
            image: products[2].image
          }
        ],
        total: (products[1].price * 2) + products[2].price
      }
    ]);

    console.log('✅ Carts created');

    // Create sample orders
    console.log('Creating sample orders...');
    await Order.create([
      {
        user: user1._id,
        items: [
          {
            product: products[3]._id,
            name: products[3].name,
            price: products[3].price,
            quantity: 1,
            image: products[3].image
          }
        ],
        subtotal: products[3].price,
        tax: (products[3].price * 0.15).toFixed(2),
        total: (products[3].price + (products[3].price * 0.15)).toFixed(2),
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'customer1@nardos.com',
          phone: '+251911234568',
          address: '123 Main St',
          city: 'Addis Ababa',
          country: 'Ethiopia'
        },
        paymentMethod: 'Telebirr',
        status: 'delivered'
      },
      {
        user: user2._id,
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            price: products[0].price,
            quantity: 1,
            image: products[0].image
          },
          {
            product: products[4]._id,
            name: products[4].name,
            price: products[4].price,
            quantity: 2,
            image: products[4].image
          }
        ],
        subtotal: products[0].price + (products[4].price * 2),
        tax: ((products[0].price + (products[4].price * 2)) * 0.15).toFixed(2),
        total: (products[0].price + (products[4].price * 2) + ((products[0].price + (products[4].price * 2)) * 0.15)).toFixed(2),
        shippingAddress: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'customer2@nardos.com',
          phone: '+251911234569',
          address: '456 Oak Ave',
          city: 'Dire Dawa',
          country: 'Ethiopia'
        },
        paymentMethod: 'CBE',
        status: 'shipped'
      }
    ]);

    console.log('✅ Orders created');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Sample Users:');
    console.log('  Admin: admin@nardos.com / sami@2124');
    console.log('  User 1: customer1@nardos.com / user123');
    console.log('  User 2: customer2@nardos.com / user123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
    process.exit(1);
  }
};

seedDatabase();
