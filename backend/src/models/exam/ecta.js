const mongoose = require('mongoose');

const formFieldSchema = new mongoose.Schema({
  label: String,
  type: String,
  placeholder: String,
  required: Boolean,
  order: Number,
}, { _id: false });

const examOptionSchema = new mongoose.Schema({
  value: String,
  label: String,
  isActive: Boolean,
}, { _id: false });

const ctaContentSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  benefits: [String],
  successRate: Number,
  successRateText: String,
  studentsEnrolled: Number,
  formFields: [formFieldSchema],
  examOptions: [examOptionSchema],
  partnerLogos: Number,
  isActive: Boolean,
}, { timestamps: true });

module.exports = mongoose.model('CTAContent', ctaContentSchema);
