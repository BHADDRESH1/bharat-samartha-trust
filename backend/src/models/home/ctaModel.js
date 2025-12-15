const mongoose = require('mongoose');

const ButtonSchema = new mongoose.Schema({
  text: { type: String, required: true },
  url: { type: String, required: true },
  style: { type: String, required: true }
});

const AnimationSchema = new mongoose.Schema({
  title: {
    type: String,
    enum: ['fadeIn', 'slideUp', 'slideDown', 'none'],
    default: 'fadeIn'
  },
  description: {
    type: String,
    enum: ['fadeIn', 'slideUp', 'slideDown', 'none'],
    default: 'fadeIn'
  },
  buttons: {
    type: String,
    enum: ['fadeIn', 'slideUp', 'slideDown', 'none'],
    default: 'fadeIn'
  }
});

const CtaSectionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  primaryButton: { type: ButtonSchema, required: true },
  secondaryButton: { type: ButtonSchema, required: true },
  backgroundStyle: {
    type: String,
    enum: ['gradient', 'solid', 'image'],
    default: 'gradient'
  },
  gradientFrom: { type: String },
  gradientTo: { type: String },
  backgroundColor: { type: String },
  backgroundImage: { type: String },
  textColor: { type: String },
  enabled: { type: Boolean, default: true },
  animation: { type: AnimationSchema, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('CtaSection', CtaSectionSchema);
