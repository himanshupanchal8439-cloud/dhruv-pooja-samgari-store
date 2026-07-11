const express = require('express');
const { listActivityLogs } = require('../controllers/activityLogController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('admin'), listActivityLogs);

module.exports = router;
