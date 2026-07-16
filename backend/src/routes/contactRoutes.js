const express = require('express');
const { submitContact, listContactMessages, deleteContactMessage } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', submitContact);
router.get('/', protect, authorize('admin', 'staff'), listContactMessages);
router.delete('/:id', protect, authorize('admin', 'staff'), deleteContactMessage);

module.exports = router;
