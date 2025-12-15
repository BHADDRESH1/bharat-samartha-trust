const mongoose = require('mongoose');

const ThankYouModalSchema = new mongoose.Schema({
  modalContent: {
    title: String,
    description: String,
    impactMessages: {
      high: String,
      medium: String,
      low: String,
    },
    shareText: String,
    closeButtonText: String
  },
  designSettings: {
    primaryColor: String,
    successColor: String,
    backgroundColor: String,
    textColor: String,
    borderRadius: String,
    showConfetti: Boolean,
    confettiColors: [String],
    animationDuration: Number,
    modalSize: String
  },
  behaviorSettings: {
    autoClose: Boolean,
    autoCloseDelay: Number,
    showShareButtons: Boolean,
    enableSocialSharing: Boolean,
    showImpactSection: Boolean,
    enablePersonalization: Boolean,
    trackingEnabled: Boolean,
    showAnimation: Boolean
  },
  socialSettings: {
    facebook: {
      enabled: Boolean,
      shareText: String
    },
    twitter: {
      enabled: Boolean,
      shareText: String
    },
    email: {
      enabled: Boolean,
      subject: String,
      body: String
    }
  },
  impactThresholds: {
    high: Number,
    medium: Number,
    mealCost: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('ThankYouModal', ThankYouModalSchema);
