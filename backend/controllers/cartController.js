const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get Cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
      await cart.save();
    } else {
      let changed = false;
      cart.items.forEach(item => {
        if (!item.product) return;
        const product = item.product;
        if (item.name !== product.name || item.price !== product.price || item.image !== product.image) {
          item.name = product.name;
          item.price = product.price;
          item.image = product.image;
          changed = true;
        }
      });
      if (changed) await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product or quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image
      });
    }

    // Calculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();

    await cart.save();
    res.json({ message: 'Product added to cart', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Cart Item
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    if (quantity === 0) {
      cart.items = cart.items.filter(item => item.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();

    await cart.save();
    res.json({ message: 'Cart updated', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();

    await cart.save();
    res.json({ message: 'Item removed from cart', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear Cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.total = 0;
    cart.updatedAt = new Date();

    await cart.save();
    res.json({ message: 'Cart cleared', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
