const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema(
  {
    size: String,
    color: String,
    sku: String,
    price: Number,
    stock: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    images: [String],
    videos: [String],
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, default: null },
    stock: { type: Number, default: 0 },
    variants: [variantSchema],
    isActive: { type: Boolean, default: true },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
