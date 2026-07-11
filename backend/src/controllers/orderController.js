const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { verifySignature } = require('./paymentController');

async function createOrder(req, res, next) {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

    if (paymentMethod === 'razorpay') {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({ message: 'Missing payment verification details' });
      }
      if (!verifySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature })) {
        return res.status(400).json({ message: 'Payment verification failed' });
      }
    }

    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) return res.status(400).json({ message: `Product unavailable: ${item.product}` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });

      subtotal += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0],
        price: product.price,
        quantity: item.quantity,
        variant: item.variant,
      });
    }

    let discount = 0;
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (!coupon) return res.status(400).json({ message: 'Invalid coupon' });
      if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ message: 'Coupon expired' });
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: 'Coupon usage limit reached' });
      if (subtotal < coupon.minOrderValue) return res.status(400).json({ message: `Minimum order value is ₹${coupon.minOrderValue}` });
      discount = coupon.discountType === 'percent' ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
      discount = Math.min(discount, subtotal);
    }

    const shippingFee = subtotal - discount > 999 ? 0 : 79;
    const total = subtotal - discount + shippingFee;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      discount,
      shippingFee,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'razorpay' ? 'paid' : 'pending',
      status: paymentMethod === 'razorpay' ? 'confirmed' : 'pending',
      paymentId: razorpayPaymentId,
      couponCode: coupon?.code,
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }
    if (coupon) {
      await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

async function myOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && !['admin', 'staff'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}

async function listAllOrders(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)).populate('user', 'name email'),
      Order.countDocuments(filter),
    ]);
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, myOrders, getOrder, listAllOrders, updateOrderStatus };
