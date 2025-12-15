const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  subject: { type: String, required: true },
  thumbnail: { type: String },
  downloadUrl: { type: String },
  rating: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  date: { type: String },
  description: { type: String },
  fileSize: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' }
});

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
