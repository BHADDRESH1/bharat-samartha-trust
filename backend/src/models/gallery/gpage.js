const mongoose = require('mongoose');

// Avoid redefining models when hot-reloading
const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String
}));

const GalleryItem = mongoose.models.GalleryItem || mongoose.model('GalleryItem', new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  uploadDate: { type: Date, default: Date.now },
  thumbnail: String,
  imageUrl: String,
  featured: { type: Boolean, default: false },
  rotatingGallery: { type: Boolean, default: false },
  tags: [String]
}));

module.exports = { Category, GalleryItem };
