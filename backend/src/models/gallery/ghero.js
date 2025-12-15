const mongoose = require('mongoose');

const heroSettingsSchema = new mongoose.Schema({
  backgroundType: { type: String, enum: ['video', 'image'], default: 'video' },
  videoUrl: String,
  imageUrl: String,
  title: String,
  subtitle: String,
  overlayOpacity: Number,
  overlayColor: String,
  titleColor: String,
  subtitleColor: String,
  titleSize: {
    mobile: String,
    tablet: String,
    desktop: String,
  },
  subtitleSize: {
    mobile: String,
    tablet: String,
    desktop: String,
  },
  animationDelay: {
    title: Number,
    subtitle: Number,
  },
  autoplay: Boolean,
  loop: Boolean,
  muted: Boolean,
}, { timestamps: true });

module.exports = mongoose.model('HeroSettings', heroSettingsSchema);
