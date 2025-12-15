const mongoose = require('mongoose');

const transformProjectSchema = new mongoose.Schema({
  beforeImage: String,
  afterImage: String,
  title: String,
  description: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TransformProject', transformProjectSchema);
