const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage config for audio
const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'newsletter_audios',
    resource_type: 'video', // important for audio files
    allowed_formats: ['mp3', 'wav', 'aac', 'ogg', 'm4a', 'mpeg'],
  },
});

const uploadAudio = multer({ storage: audioStorage });

exports.uploadAudio = [
  uploadAudio.single('file'), // ✅ field name MUST match frontend
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file uploaded' });
    }

    const { originalname, size, path } = req.file;
    const { type } = req.body;

    const newTrack = {
      id: Date.now().toString(),
      name: originalname.replace(/\.[^/.]+$/, ''),
      url: path,
      duration: 0,
      size: `${(size / 1024 / 1024).toFixed(1)} MB`,
      type: type || 'effect',
      isDefault: false
    };

    res.status(200).json(newTrack);
  }
];
