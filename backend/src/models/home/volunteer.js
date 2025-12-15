const mongoose = require('mongoose');

const volunteerOpportunitySchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  requirements: [String],
  timeCommitment: String,
  location: String,
  spotsAvailable: Number,
  currentVolunteers: Number,
  skillsRequired: [String],
  benefits: [String],
  visible: Boolean,
  urgent: Boolean,
  remote: Boolean,
  icon: String,
  color: String
});

const volunteerManagementSchema = new mongoose.Schema({
  sectionSettings: {
    sectionVisible: { type: Boolean, default: true },
    sectionTitle: { type: String, default: 'Volunteer Opportunities' },
    sectionSubtitle: { type: String, default: 'Join our mission to make a difference' },
    highlightUrgent: { type: Boolean, default: true },
    showSkillsRequired: { type: Boolean, default: true },
    showBenefits: { type: Boolean, default: true }
  },
  opportunities: [volunteerOpportunitySchema]
}, { timestamps: true });

module.exports = mongoose.model('VolunteerManagement', volunteerManagementSchema);
