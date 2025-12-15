const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 📄 File Storage Config (for PDFs)
const fileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'previous_year_papers/files',
    allowed_formats: ['pdf','doc','docx'],
    resource_type: 'raw', // 🔥 for non-image, non-video files (like .pdf, .zip, .docx etc.)
  },
});

const uploadFileMiddleware = multer({ storage: fileStorage });

exports.uploadPaperFile = [
  uploadFileMiddleware.single('file'), // 🗂️ field name = 'file'
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ url: req.file.path, fileSize: req.file.bytes });
  }
];
