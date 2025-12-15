const mongoose = require('mongoose');

// Right Model
const RightSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  icon: String, // name/slug of icon
  details: [String],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  lastUpdated: String,
  views: { type: Number, default: 0 }
});

// Scheme Model
const SchemeSchema = new mongoose.Schema({
  name: String,
  description: String,
  eligibility: [String],
  benefits: [String],
  category: String,
  applyLink: String,
  status: { type: String, enum: ['active', 'closed', 'upcoming'], default: 'active' },
  lastUpdated: String,
  applications: { type: Number, default: 0 }
});

// Resource Model
const ResourceSchema = new mongoose.Schema({
  title: String,
  language: String,
  size: String,
  format: String,
  downloads: { type: Number, default: 0 },
  uploadDate: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  fileUrl: String
});

const Right = mongoose.model('Right', RightSchema);
const Scheme = mongoose.model('Scheme', SchemeSchema);
const Resource = mongoose.model('Resource', ResourceSchema);

module.exports = { Right, Scheme, Resource };
