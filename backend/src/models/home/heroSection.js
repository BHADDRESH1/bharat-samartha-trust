// models/CTASection.js
const mongoose = require('mongoose');

const AnimationSchema = new mongoose.Schema({
  initial: { opacity: Number, y: Number },
  animate: { opacity: Number, y: Number },
  transition: { duration: Number, delay: Number }
}, { _id: false });

const ButtonSchema = new mongoose.Schema({
  text: String,
  url: String,
  className: String
}, { _id: false });

const CTASectionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  primaryButton: ButtonSchema,
  secondaryButton: ButtonSchema,
  sectionClassName: String,
  containerClassName: String,
  enabled: Boolean,
  animation: {
    title: AnimationSchema,
    description: AnimationSchema,
    buttons: AnimationSchema
  }
});

module.exports = mongoose.model('heroSection', CTASectionSchema);
