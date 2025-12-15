const mongoose = require('mongoose');

const volunteerRoleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String, default: '/icons/default.svg' },
  commitment: { type: String },
  skills: [{ type: String }],
  isActive: { type: Boolean, default: true },
  applicantsCount: { type: Number, default: 0 },
  createdDate: { type: String },
  lastUpdated: { type: String }
});

module.exports = mongoose.model('VolunteerRole', volunteerRoleSchema);
