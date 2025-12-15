// models/dailyActivityModel.js
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  id: Number,
  title: String,
  time: String,
  location: String,
  description: String,
  days: [String],
  visible: Boolean,
  volunteers: Number,
  beneficiaries: Number,
  icon: String,
  color: String
});

const SettingsSchema = new mongoose.Schema({
  sectionVisible: Boolean,
  sectionTitle: String,
  sectionSubtitle: String,
  showSchedule: Boolean,
  showVolunteerCount: Boolean,
  showBeneficiaryCount: Boolean
});

const DailyDataSchema = new mongoose.Schema({
  activities: [ActivitySchema],
  settings: SettingsSchema
});

module.exports = mongoose.model('DailyData', DailyDataSchema);
