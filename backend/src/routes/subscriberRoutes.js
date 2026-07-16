const express = require('express');
const { subscribe, listSubscribers, deleteSubscriber } = require('../controllers/subscriberController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', subscribe);
router.get('/', protect, authorize('admin', 'staff'), listSubscribers);
router.delete('/:id', protect, authorize('admin', 'staff'), deleteSubscriber);

module.exports = router;
