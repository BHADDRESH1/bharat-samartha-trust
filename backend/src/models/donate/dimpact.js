const mongoose = require('mongoose');

const ImpactStatSchema = new mongoose.Schema({
  stat: Number,
  label: String,
  icon: String,
  prefix: String,
  suffix: String,
  color: String,
  isActive: Boolean
}, { _id: false });

const MonthlyGoalSchema = new mongoose.Schema({
  goal: Number,
  currentRaised: Number,
  currency: String,
  targetMonth: String
}, { _id: false });

const SettingsSchema = new mongoose.Schema({
  animationDuration: Number,
  enableScrollTrigger: Boolean,
  displayFormat: String,
  showProgressBar: Boolean,
  enableHoverEffects: Boolean
}, { _id: false });

const ImpactMeterSchema = new mongoose.Schema({
  impactStats: [ImpactStatSchema],
  monthlyGoal: MonthlyGoalSchema,
  settings: SettingsSchema
}, { timestamps: true });

module.exports = mongoose.model('ImpactMeter', ImpactMeterSchema);
