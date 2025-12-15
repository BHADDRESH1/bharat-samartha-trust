// models/testimonialModel.js
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  quote: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 5 },
  dateAdded: { type: String, required: true },
  order: { type: Number, default: 1 }
}, { timestamps: true });

const sectionSettingsSchema = new mongoose.Schema({
  isEnabled: { type: Boolean, default: true },
  title: { type: String, default: 'Donor Stories' },
  subtitle: { type: String, default: '' },
  autoScroll: { type: Boolean, default: true },
  scrollSpeed: { type: Number, default: 100 },
  showRatings: { type: Boolean, default: true },
  maxVisible: { type: Number, default: 10 }
});

const dTestimonial = mongoose.model('dTestimonial', testimonialSchema);
const TestimonialSettings = mongoose.model('TestimonialSettings', sectionSettingsSchema);

module.exports = { dTestimonial, TestimonialSettings };
