const User = require('../models/User');
const Order = require('../models/Order');

async function listCustomers(req, res, next) {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = { role: 'customer' };
    if (search) {
      filter.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [customers, total] = await Promise.all([
      User.find(filter).select('-password').sort('-createdAt').skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);
    res.json({ customers, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

async function getCustomerOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.params.id }).sort('-createdAt');
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function setBlockedStatus(req, res, next) {
  try {
    const { isBlocked } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Customer not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { listCustomers, getCustomerOrders, setBlockedStatus };
