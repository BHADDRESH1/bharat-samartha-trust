const mongoose = require('mongoose');

const topVolunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hours: { type: Number, required: true },
  badge: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, default: '/avatars/default-volunteer.jpg' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  joinDate: { type: Date, default: Date.now }
}, { _id: true }); // Keep _id for individual volunteer ops

const dashboardSchema = new mongoose.Schema({
  stats: {
    volunteersThisMonth: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    livesImpacted: { type: Number, default: 0 }
  },
  topVolunteers: [topVolunteerSchema]
}, { timestamps: true });

module.exports = mongoose.model('Dashboard', dashboardSchema);
