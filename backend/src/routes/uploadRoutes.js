const express = require('express');
const { upload, uploadVideo } = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('admin', 'staff'), upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const url = `${req.protocol}://${req.get('host')}/static/uploads/products/${req.file.filename}`;
  res.status(201).json({ url });
});

router.post('/video', protect, authorize('admin', 'staff'), uploadVideo.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const url = `${req.protocol}://${req.get('host')}/static/uploads/videos/${req.file.filename}`;
  res.status(201).json({ url });
});

module.exports = router;
