// models/heroBannerSettings.js
const mongoose = require('mongoose');

const heroBannerSettingsSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  buttonText: String,
  buttonAction: {
    type: String,
    enum: ['scroll', 'link', 'popup'],
    default: 'scroll'
  },
  buttonLink: String,
  videoUrl: String,
  videoType: {
    type: String,
    enum: ['local', 'youtube', 'vimeo'],
    default: 'local'
  },
  overlayOpacity: Number,
  titleColor: String,
  subtitleColor: String,
  buttonColor: String,
  buttonTextColor: String,
  enableTypewriter: Boolean,
  typewriterSpeed: Number,
  enableScrollIndicator: Boolean,
  maxHeight: Number,
  enableVideoControls: Boolean,
  autoplay: Boolean,
  loop: Boolean,
  muted: Boolean
}, { timestamps: true });

module.exports = mongoose.model('HeroBannerSettings', heroBannerSettingsSchema);
