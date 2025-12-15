const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  caseNumber: String,
  title: String,
  court: String,
  status: { type: String, enum: ['pending', 'active', 'closed', 'archived'], default: 'pending' },
  petitioner: String,
  respondent: String,
  judge: String,
  createdAt: String,
  updatedAt: String,
  description: String,
  nextHearing: String,
  documents: [String]
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, enum: ['admin', 'lawyer', 'clerk', 'user'], default: 'user' },
  lastActive: String,
  casesAssigned: Number,
  phone: String,
  address: String,
  isActive: Boolean
});

const settingSchema = new mongoose.Schema({
  autoAssign: Boolean,
  notifications: Boolean,
  userRegistration: Boolean,
  selfService: Boolean,
  backupFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' }
});

const logSchema = new mongoose.Schema({
  user: String,
  action: String,
  timestamp: String,
  ipAddress: String,
  details: String
});

module.exports = {
  Case: mongoose.model('Case', caseSchema),
  User: mongoose.model('User', userSchema),
  Setting: mongoose.model('Setting', settingSchema),
  Log: mongoose.model('Log', logSchema)
};
