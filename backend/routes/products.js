const express = require('express');
const { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  addReview 
} = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${extension}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('image/')) return callback(null, true);
    callback(new Error('Only image files are allowed'));
  }
});

// Get All Products
router.get('/', getAllProducts);

// Get Single Product
router.get('/:id', getProductById);

// Add Review to Product
router.post('/:id/review', authMiddleware, addReview);

// Create Product (Admin Only)
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createProduct);

// Update Product (Admin Only)
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateProduct);

// Delete Product (Admin Only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError || error.message === 'Only image files are allowed') {
    return res.status(400).json({ message: error.message });
  }
  next(error);
});

module.exports = router;
