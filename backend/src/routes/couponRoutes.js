const express = require('express');
const {
  listCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');
const logActivity = require('../middleware/logActivity');

const router = express.Router();

router.post('/validate', validateCoupon);
router.get('/', protect, authorize('admin', 'staff'), listCoupons);
router.post('/', protect, authorize('admin'), logActivity('create_coupon'), createCoupon);
router.put('/:id', protect, authorize('admin'), logActivity('update_coupon'), updateCoupon);
router.delete('/:id', protect, authorize('admin'), logActivity('delete_coupon'), deleteCoupon);

module.exports = router;
