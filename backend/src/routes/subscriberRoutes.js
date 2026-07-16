const express = require('express');
const { subscribe, listSubscribers } = require('../controllers/subscriberController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', subscribe);
router.get('/', protect, authorize('admin', 'staff'), listSubscribers);

module.exports = router;
