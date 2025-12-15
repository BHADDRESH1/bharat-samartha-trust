const mongoose = require('mongoose');

const helplineSchema = new mongoose.Schema({
  name: String,
  category: String,
  phone: String,
  hours: String,
  languages: [String],
  services: [String],
  isEmergency: Boolean,
  isActive: Boolean,
  lastUpdated: String,
  totalCalls: Number
});

const centerSchema = new mongoose.Schema({
  name: String,
  address: String,
  district: String,
  phone: String,
  services: [String],
  timings: String,
  isActive: Boolean,
  capacity: Number,
  currentCases: Number
});

const resourceSchema = new mongoose.Schema({
  title: String,
  type: String,
  size: String,
  downloads: String,
  category: String,
  isActive: Boolean,
  lastUpdated: String,
  fileUrl: String,       // ✅ Added
  videoUrl: String       // ✅ Added
});


const Helpline = mongoose.model('Helpline', helplineSchema);
const LegalAidCenter = mongoose.model('LegalAidCenter', centerSchema);
const SupportResource = mongoose.model('SupportResource', resourceSchema);

module.exports = { Helpline, LegalAidCenter, SupportResource };
