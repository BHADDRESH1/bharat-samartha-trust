const mongoose = require('mongoose');

const audioTrackSchema = new mongoose.Schema({
  id: String, // frontend ID
  name: String,
  url: String,
  duration: Number,
  size: String,
  type: { type: String, enum: ['background', 'effect'] },
  isDefault: { type: Boolean, default: false }
}, { _id: false });

const audioConfigSchema = new mongoose.Schema({
  audioTracks: [audioTrackSchema],
  
  globalMuted: Boolean,
  globalAutoPlay: Boolean,
  globalVolume: Number,

  backgroundMusic: {
    enabled: Boolean,
    track: String,
    volume: Number,
    fadeIn: Boolean,
    fadeOut: Boolean,
    loop: Boolean
  },

  soundEffects: {
    enabled: Boolean,
    volume: Number,
    hoverSound: String,
    clickSound: String,
    transitionSound: String
  },

  controlsVisibility: {
    showPlayPause: Boolean,
    showVolumeControl: Boolean,
    showAutoPlayToggle: Boolean,
    showOnMobile: Boolean,
    position: {
      type: String,
      enum: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    }
  }
});

module.exports = mongoose.model('AudioConfig', audioConfigSchema);
