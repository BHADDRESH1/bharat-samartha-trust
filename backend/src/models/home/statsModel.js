const mongoose = require('mongoose');

const StatItemSchema = new mongoose.Schema({
  id: String,
  icon: String,
  value: String,
  label: String,
  suffix: String,
  color: String,
  isActive: Boolean,
  order: Number
}, { _id: false });

const StatsSectionSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  isActive: Boolean,
  backgroundColor: String,
  animationType: String,
  stats: [StatItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('StatsSection', StatsSectionSchema);
