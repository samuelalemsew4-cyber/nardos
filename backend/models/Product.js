const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Men', 'Women', 'Unisex', 'Luxury / Men', 'Luxury / Women', 'Luxury / Unisex'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: String,
  stock: {
    type: Number,
    default: 100,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: mongoose.Schema.Types.ObjectId,
    comment: String,
    rating: Number,
    createdAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.model('Product', productSchema);
