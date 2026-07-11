const Review = require('../models/Review');
const Product = require('../models/Product');

async function recalculateRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  const { avg = 0, count = 0 } = stats[0] || {};
  await Product.findByIdAndUpdate(productId, { ratingAverage: avg, ratingCount: count });
}

async function listReviews(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const reviews = await Review.find({ product: product._id }).sort('-createdAt');
    res.json(reviews);
  } catch (err) {
    next(err);
  }
}

async function createReview(req, res, next) {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existing = await Review.findOne({ product: product._id, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this product' });

    const review = await Review.create({
      product: product._id,
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
    });

    await recalculateRating(product._id);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
}

module.exports = { listReviews, createReview };
