const express = require('express');
const { body } = require('express-validator');
const { register, login, logout, me, sendOtp, verifyOtp } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  validate,
  register
);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validate, login);
router.post('/send-otp', [body('email').isEmail()], validate, sendOtp);
router.post('/verify-otp', [body('email').isEmail(), body('code').isLength({ min: 6, max: 6 })], validate, verifyOtp);
router.post('/logout', logout);
router.get('/me', protect, me);

module.exports = router;
