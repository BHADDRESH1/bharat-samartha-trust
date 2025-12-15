const mongoose = require('mongoose');

const sectionSettingsSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  backgroundColor: { type: String, default: 'bg-white' },
  textColor: { type: String, default: 'text-black' },
  isVisible: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('TransformSectionSettings', sectionSettingsSchema);
