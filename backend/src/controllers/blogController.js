const BlogPost = require('../models/BlogPost');

async function listPosts(req, res, next) {
  try {
    const { language, search, page = 1, limit = 12 } = req.query;
    const filter = { isPublished: true };
    if (language) filter.language = language;
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [posts, total] = await Promise.all([
      BlogPost.find(filter).select('-content').sort('-createdAt').skip(skip).limit(Number(limit)),
      BlogPost.countDocuments(filter),
    ]);

    res.json({ posts, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

async function listAllPosts(req, res, next) {
  try {
    const posts = await BlogPost.find({}).select('-content').sort('-createdAt');
    res.json(posts);
  } catch (err) {
    next(err);
  }
}

async function getPost(req, res, next) {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

async function getPostAdmin(req, res, next) {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

async function createPost(req, res, next) {
  try {
    const post = await BlogPost.create({ ...req.body, author: req.user._id });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

async function updatePost(req, res, next) {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listPosts, listAllPosts, getPost, getPostAdmin, createPost, updatePost, deletePost };
