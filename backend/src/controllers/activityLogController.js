const ActivityLog = require('../models/ActivityLog');

async function listActivityLogs(req, res, next) {
  try {
    const { page = 1, limit = 30 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [logs, total] = await Promise.all([
      ActivityLog.find().sort('-createdAt').skip(skip).limit(Number(limit)).populate('admin', 'name email'),
      ActivityLog.countDocuments(),
    ]);
    res.json({ logs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

module.exports = { listActivityLogs };
