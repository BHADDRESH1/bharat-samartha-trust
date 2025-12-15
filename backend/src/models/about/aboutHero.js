// models/AboutHero.js
const mongoose = require('mongoose');

const OverlayGradientSchema = new mongoose.Schema({
  from: String,
  to: String,
  opacity: Number,
}, { _id: false });

const AboutHeroSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  backgroundImage: String,
  backgroundVideo: String,
  overlayGradient: OverlayGradientSchema,
  showScrollIndicator: Boolean,
  height: String,
  isVisible: Boolean
}, { timestamps: true });

module.exports = mongoose.model('AboutHero', AboutHeroSchema);
