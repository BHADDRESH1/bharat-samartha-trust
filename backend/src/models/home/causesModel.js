const mongoose = require('mongoose');

const causeSchema = new mongoose.Schema({
  id:Number,
  title: String,
  description: String,
  image: String,
  raised: Number,
  goal: Number,
  donors: Number,
  category: String,
  featured: Boolean,
  priority: Number,
  endDate: Date,
  status: String,
  tags: [String]
});

const featuredCausesSectionSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  maxDisplayed: Number,
  causes: [causeSchema]
});

module.exports = mongoose.model('FeaturedCauseSection', featuredCausesSectionSchema);
