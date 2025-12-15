const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  icon: { type: String, default: 'award' },
  eligibility: String,
  pattern: String,
  opportunities: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
