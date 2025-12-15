// models/volunteerModel.js
const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  interests: [String],
  availability: String,
  commitmentType: {
    type: String,
    enum: ['one-time', 'recurring'],
  },
  skills: [String],
  experience: String,
  languages: [String],
  aadhaarCardPath: String,
  photoPath: String,
  volunteerId: String,
  certificateDate: String,
  badgeLevel: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);
