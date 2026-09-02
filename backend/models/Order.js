const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  subtotal: {
    type: Number,
    required: true
  },
  tax: Number,
  total: {
    type: Number,
    required: true
  },
  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['Telebirr', 'CBE', 'Abay', 'e-Mpesa', 'Card'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
