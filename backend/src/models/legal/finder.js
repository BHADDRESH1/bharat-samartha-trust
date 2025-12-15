const mongoose = require('mongoose');

// Law Schema
const lawSchema = new mongoose.Schema({
  title: { type: String, required: true },
  act: { type: String, required: true },
  sections: [{ type: String }],
  keywords: [{ type: String }],
  summary: { type: String, required: true },
  fullText: { type: String, required: true }
}, { timestamps: true });

// Settings Schema
const settingsSchema = new mongoose.Schema({
  fuzzySearch: { type: Boolean, default: true },
  keywordHighlighting: { type: Boolean, default: true },
  searchSuggestions: { type: Boolean, default: true },
  adminApproval: { type: Boolean, default: false },
  auditLog: { type: Boolean, default: true }
}, { timestamps: true });

const Law = mongoose.model('fLaw', lawSchema);
const Settings = mongoose.model('fSettings', settingsSchema);

// Export both models in one object
module.exports = { Law, Settings };
