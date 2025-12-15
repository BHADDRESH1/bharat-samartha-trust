const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  location: String,
  image: String,
  quote: String,
  rating: Number,
  yearsSince: Number,
  status: {
    type: String,
    enum: ['pending', 'published', 'featured', 'rejected'],
    default: 'pending'
  },
  submittedDate: String,
  publishedDate: String,
  category: String,
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('vTest', testimonialSchema);
