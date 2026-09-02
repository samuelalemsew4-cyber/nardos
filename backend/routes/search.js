const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Search Products
router.get('/', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (category) filter.category = category;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Product.find(filter);

    // Sorting
    if (sort === 'price-low') {
      query = query.sort({ price: 1 });
    } else if (sort === 'price-high') {
      query = query.sort({ price: -1 });
    } else if (sort === 'newest') {
      query = query.sort({ createdAt: -1 });
    } else if (sort === 'rating') {
      query = query.sort({ rating: -1 });
    }

    const products = await query.limit(50);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
