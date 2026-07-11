const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

async function getStats(req, res, next) {
  try {
    const [totalOrders, totalRevenueAgg, lowStockProducts, totalCustomers, recentOrders] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Product.find({ isActive: true, stock: { $lte: 5 } }).select('name stock'),
      User.countDocuments({ role: 'customer' }),
      Order.find().sort('-createdAt').limit(5).populate('user', 'name'),
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenueAgg[0]?.total || 0,
      lowStockProducts,
      totalCustomers,
      recentOrders,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };
