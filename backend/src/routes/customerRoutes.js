const express = require('express');
const { listCustomers, getCustomerOrders, setBlockedStatus } = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');
const logActivity = require('../middleware/logActivity');

const router = express.Router();

router.get('/', protect, authorize('admin', 'staff'), listCustomers);
router.get('/:id/orders', protect, authorize('admin', 'staff'), getCustomerOrders);
router.put('/:id/block', protect, authorize('admin'), logActivity('toggle_customer_block'), setBlockedStatus);

module.exports = router;
