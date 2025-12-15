const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  
  question: { type: String, required: true },
  answer: { type: String, required: true },
  gif: { type: String },
  category: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdDate: { type: String },
  lastModified: { type: String },
  views: { type: Number, default: 0 }
});

module.exports = mongoose.model('FAQ', faqSchema);
