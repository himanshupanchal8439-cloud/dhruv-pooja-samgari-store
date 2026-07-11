const Coupon = require('../models/Coupon');

async function listCoupons(req, res, next) {
  try {
    res.json(await Coupon.find().sort('-createdAt'));
  } catch (err) {
    next(err);
  }
}

async function createCoupon(req, res, next) {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    next(err);
  }
}

async function updateCoupon(req, res, next) {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
  } catch (err) {
    next(err);
  }
}

async function deleteCoupon(req, res, next) {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    next(err);
  }
}

async function validateCoupon(req, res, next) {
  try {
    const { code, subtotal } = req.body;
    const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon' });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ message: 'Coupon expired' });
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: 'Coupon usage limit reached' });
    if (subtotal < coupon.minOrderValue) {
      return res.status(400).json({ message: `Minimum order value is ₹${coupon.minOrderValue}` });
    }

    const discount = coupon.discountType === 'percent' ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
    res.json({ code: coupon.code, discount: Math.min(discount, subtotal) });
  } catch (err) {
    next(err);
  }
}

module.exports = { listCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon };
