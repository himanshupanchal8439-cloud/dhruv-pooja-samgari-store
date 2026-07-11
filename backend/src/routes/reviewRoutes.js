const express = require('express');
const { body } = require('express-validator');
const { listReviews, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/:slug/reviews', listReviews);
router.post(
  '/:slug/reviews',
  protect,
  [body('rating').isInt({ min: 1, max: 5 }), body('comment').trim().notEmpty()],
  validate,
  createReview
);

module.exports = router;
