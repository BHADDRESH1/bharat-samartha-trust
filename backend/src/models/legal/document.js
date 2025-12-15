const mongoose = require('mongoose');

const DocumentTemplateSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: String,
  description: String,
  templateContent: String,
  usageCount: { type: Number, default: 0 },
  lastUpdated: { type: String }, // e.g. "2024-01-15"
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  fields: Number
});

const AppSettingsSchema = new mongoose.Schema({
  pdfQuality: String,
  pageSize: String,
  includeWatermark: Boolean,
  requireLogin: Boolean,
  enablePreview: Boolean,
  maxDocumentsPerDay: Number,
  createdAt: { type: Date, default: Date.now }
});

const DocumentTemplate = mongoose.model('DocumentTemplate', DocumentTemplateSchema);
const AppSettings = mongoose.model('AppSettings', AppSettingsSchema);

module.exports = { DocumentTemplate, AppSettings };
