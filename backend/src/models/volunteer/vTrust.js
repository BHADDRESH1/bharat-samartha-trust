const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, default: '/images/partners/default.svg' },
  website: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  partnership_since: { type: Date, required: true },
  description: { type: String },
  contact_email: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);
