const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  exam: String,
  year: Number,
  subject: String,
  questions: Number,
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  uploadDate: { type: Date, default: Date.now },
  fileSize: String,
  fileName: String,
  fileUrl:String,
  status: { type: String, enum: ['Active', 'Inactive', 'Pending'], default: 'Pending' }
});

module.exports = mongoose.model('Paper', paperSchema);
