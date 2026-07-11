const express = require('express');
const { body } = require('express-validator');
const { updateProfile, addAddress, updateAddress, deleteAddress } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.put('/me', [body('name').optional().trim().notEmpty()], validate, updateProfile);

router.post(
  '/me/addresses',
  [
    body('line1').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('state').trim().notEmpty(),
    body('pincode').trim().notEmpty(),
  ],
  validate,
  addAddress
);

router.put('/me/addresses/:addressId', updateAddress);
router.delete('/me/addresses/:addressId', deleteAddress);

module.exports = router;
