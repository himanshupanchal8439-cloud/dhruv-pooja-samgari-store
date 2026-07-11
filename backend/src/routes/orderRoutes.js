const express = require('express');
const {
  createOrder,
  myOrders,
  getOrder,
  listAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const logActivity = require('../middleware/logActivity');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/mine', protect, myOrders);
router.get('/:id', protect, getOrder);
router.get('/', protect, authorize('admin', 'staff'), listAllOrders);
router.put('/:id/status', protect, authorize('admin', 'staff'), logActivity('update_order_status'), updateOrderStatus);

module.exports = router;
