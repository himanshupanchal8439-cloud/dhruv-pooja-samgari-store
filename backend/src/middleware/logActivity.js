const ActivityLog = require('../models/ActivityLog');

function logActivity(action) {
  return async function (req, res, next) {
    res.on('finish', () => {
      if (res.statusCode < 400 && req.user) {
        ActivityLog.create({
          admin: req.user._id,
          action,
          details: { method: req.method, path: req.originalUrl, body: req.body },
        }).catch(() => {});
      }
    });
    next();
  };
}

module.exports = logActivity;
