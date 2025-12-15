const mongoose = require('mongoose');

const ecurrSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['news', 'quiz', 'exam']
  },

  // Common fields
  title: String,

  // For news
  category: String,
  date: String,
  summary: String,
  imageUrl: String,
  source: String,

  // For quiz
  questions: Number,
  duration: Number,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard']
  },
  participants: Number,

  // For exam
  name: String,
  daysLeft: Number
}, { timestamps: true });

module.exports = mongoose.model('EcurrItem', ecurrSchema);
