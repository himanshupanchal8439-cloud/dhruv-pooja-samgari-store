const express = require('express');
const { submitContact, listContactMessages } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', submitContact);
router.get('/', protect, authorize('admin', 'staff'), listContactMessages);

module.exports = router;
