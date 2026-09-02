const Product = require('../models/Product');

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create Product (Admin Only)
exports.createProduct = async (req, res) => {
  try {
    const { name, brand, category, description, price, stock } = req.body;

    if (!name || !brand || !category || !description || !price) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const product = new Product({
      name,
      brand,
      category,
      description,
      price,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
      stock: stock || 100
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Product (Admin Only)
exports.updateProduct = async (req, res) => {
  try {
    const { name, brand, category, description, price, stock } = req.body;

    const updates = { name, brand, category, description, price, stock, updatedAt: Date.now() };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.file) {
      await require('../models/Cart').updateMany(
        { 'items.product': product._id },
        { $set: { 'items.$[item].image': product.image } },
        { arrayFilters: [{ 'item.product': product._id }] }
      );
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Product (Admin Only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Review to Product
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.reviews.push({
      user: req.userId,
      comment,
      rating,
      createdAt: new Date()
    });

    // Update average rating
    const totalRating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    product.rating = (totalRating / product.reviews.length).toFixed(1);

    await product.save();
    res.json({ message: 'Review added successfully', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
