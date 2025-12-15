const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  id: Number,
  icon: String,
  value: Number,
  label: String,
  color: String,
  description: String,
  delay: Number
}, { _id: false });

const goalSchema = new mongoose.Schema({
  id: Number,
  text: String,
  color: String
}, { _id: false });

const impactSchema = new mongoose.Schema({
  headerData: {
    title: String,
    subtitle: String
  },
  stats: [statSchema],
  storyContent: {
    title: String,
    paragraphs: [String]
  },
  goalsContent: {
    title: String,
    goals: [goalSchema]
  },
  footerQuote: String
}, { timestamps: true });

module.exports = mongoose.model('causeImpact', impactSchema);
