const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  title: String,
  quote: String,
  buttonText: String,
  buttonLink: String,
  videoUrl: String,
  overlayOpacity: Number,
  backgroundColor: String,
  textColor: String,
  buttonColor: String,
  buttonHoverColor: String,
  enableTypewriter: Boolean,
  typewriterSpeed: Number,
  enableScrollIndicator: Boolean,
  enableVideoAutoplay: Boolean,
  enableVideoLoop: Boolean,
  enableVideoMute: Boolean
}, { timestamps: true });

module.exports = mongoose.model('vHero', heroSchema);
