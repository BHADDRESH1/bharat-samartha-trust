// backend/models/HeroBanner.js
const mongoose = require('mongoose');

const HeroBannerSchema = new mongoose.Schema({
  mainTitle: String,
  tagline: String,
  videoUrl: String,
  imageUrl: String,
  mediaType: { type: String, enum: ['video', 'image'] },
  videoPlaybackRate: Number,
  gradientOverlay: {
    from: String,
    to: String,
    opacity: String
  },
  animations: {
    titleDelay: Number,
    taglineDelay: Number,
    typingDuration: Number
  },
  floatingEmojis: {
    enabled: Boolean,
    icons: [String],
    animationDuration: Number,
    opacity: {
      min: Number,
      max: Number
    }
  },
  scrollIndicator: {
    enabled: Boolean,
    animationDuration: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('HeroBanner', HeroBannerSchema);
