const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  id: String,
  icon: String,
  number: String,
  label: String,
  description: String,
  color: String
});

const achievementSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  image: String,
  category: String,
  year: String
});

const impactSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  backgroundImage: String,
  stats: [statSchema],
  achievements: [achievementSchema]
});

module.exports = mongoose.model('Impact', impactSchema);
