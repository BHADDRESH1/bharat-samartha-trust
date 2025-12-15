const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  sectionSettings: {
    title: String,
    subtitle: String,
    volunteerText: String,
    volunteerCount: String,
    ctaText: String,
    ctaLink: String,
    showCtaSection: { type: Boolean, default: true },
    backgroundColor: String,
    isVisible: { type: Boolean, default: true }
  },
  members: [
    {
      id: String,
      name: String,
      role: String,
      bio: String,
      image: String,
      order: Number,
      isVisible: { type: Boolean, default: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
