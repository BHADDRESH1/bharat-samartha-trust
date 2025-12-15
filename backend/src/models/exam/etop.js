const mongoose = require('mongoose');

const TopperStorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  rank: { type: Number, required: true },
  exam: { type: String, required: true },
  batch: { type: String, required: true },
  quote: { type: String, required: true },
  image: { type: String },
  videoUrl: { type: String },
  highlights: { type: [String], default: [] },
  socialLinks: {
    linkedin: { type: String },
    twitter: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('TopperStory', TopperStorySchema);
