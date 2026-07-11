const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    language: { type: String, enum: ['en', 'hi'], default: 'en', index: true },
    translationSlug: { type: String, default: null },
    excerpt: { type: String, trim: true },
    content: { type: String, required: true },
    coverImage: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: true },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

blogPostSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('BlogPost', blogPostSchema);
