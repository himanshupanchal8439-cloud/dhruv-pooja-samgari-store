const express = require('express');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const logActivity = require('../middleware/logActivity');

const router = express.Router();

router.get('/', listProducts);
router.get('/:slug', getProduct);
router.post('/', protect, authorize('admin', 'staff'), logActivity('create_product'), createProduct);
router.put('/:id', protect, authorize('admin', 'staff'), logActivity('update_product'), updateProduct);
router.delete('/:id', protect, authorize('admin'), logActivity('delete_product'), deleteProduct);

module.exports = router;
