const express = require('express');
const { createRazorpayOrder } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create-order', protect, createRazorpayOrder);

module.exports = router;
