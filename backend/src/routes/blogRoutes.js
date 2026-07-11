const express = require('express');
const { body } = require('express-validator');
const {
  listPosts,
  listAllPosts,
  getPost,
  getPostAdmin,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', listPosts);
router.get('/admin/all', protect, authorize('admin', 'staff'), listAllPosts);
router.get('/admin/:id', protect, authorize('admin', 'staff'), getPostAdmin);
router.get('/:slug', getPost);

router.post(
  '/',
  protect,
  authorize('admin', 'staff'),
  [body('title').trim().notEmpty(), body('slug').trim().notEmpty(), body('content').notEmpty()],
  validate,
  createPost
);
router.put('/:id', protect, authorize('admin', 'staff'), updatePost);
router.delete('/:id', protect, authorize('admin'), deletePost);

module.exports = router;
