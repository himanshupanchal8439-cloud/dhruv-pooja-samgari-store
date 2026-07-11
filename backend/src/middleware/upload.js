const multer = require('multer');
const path = require('path');
const fs = require('fs');

const imageDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'products');
const videoDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'videos');
fs.mkdirSync(imageDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

function makeStorage(dir) {
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, unique);
    },
  });
}

function imageFileFilter(req, file, cb) {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new Error('Only image files (jpg, png, webp, gif) are allowed'));
  }
  cb(null, true);
}

function videoFileFilter(req, file, cb) {
  const allowed = ['.mp4', '.webm', '.mov'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new Error('Only video files (mp4, webm, mov) are allowed'));
  }
  cb(null, true);
}

const upload = multer({
  storage: makeStorage(imageDir),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadVideo = multer({
  storage: makeStorage(videoDir),
  fileFilter: videoFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

module.exports = { upload, uploadVideo };
