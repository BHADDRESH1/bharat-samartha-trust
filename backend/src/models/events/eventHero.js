const mongoose = require('mongoose');

const heroBannerSchema = new mongoose.Schema({
  title: String,
  highlightText: String,
  typewriterSequences: [String],
  videoUrl: String,
  videoSettings: {
    autoplay: Boolean,
    muted: Boolean,
    loop: Boolean
  },
  gradientOverlay: {
    from: String,
    to: String
  },
  nextEvent: {
    name: String,
    date: Date,
    location: String
  },
  buttons: {
    primary: {
      text: String,
      link: String,
      color: String
    },
    secondary: {
      text: String,
      link: String,
      style: String
    }
  },
  parallaxIntensity: Number,
  animationTimings: {
    titleDelay: Number,
    typewriterDelay: Number,
    countdownDelay: Number,
    buttonsDelay: Number
  }
});

module.exports = mongoose.model('eventHero', heroBannerSchema);
