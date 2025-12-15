const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true },
  image: { type: String, required: true },
  featured: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  dateSubmitted: { type: Date, required: true },
  location: { type: String },
  category: { type: String, enum: ['beneficiary', 'volunteer', 'donor', 'partner'] }
});


module.exports = mongoose.model('Testimonial', testimonialSchema);
