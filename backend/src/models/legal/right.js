const mongoose = require('mongoose');

const complaintTemplateSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  format: String,
  useCase: String,
  content: String,
  downloads: { type: Number, default: 0 },
  lastUpdated: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

const caseStorySchema = new mongoose.Schema({
  title: String,
  category: String,
  issue: String,
  resolution: String,
  timeframe: String,
  compensation: String,
  status: { type: String, enum: ['resolved', 'ongoing', 'dismissed'], default: 'resolved' },
  dateAdded: String,
  isPublic: { type: Boolean, default: true }
});


const rtiSchema = new mongoose.Schema({
  applicantName: String,
  department: String,
  submissionDate: String,
  status: { type: String, enum: ['pending', 'processed', 'completed'], default: 'pending' },
  informationType: String
});

const ComplaintTemplate = mongoose.model('ComplaintTemplate', complaintTemplateSchema);
const CaseStory = mongoose.model('CaseStory', caseStorySchema);
const RTIApplication = mongoose.model('RTIApplication', rtiSchema);

// ✅ Export all together
module.exports = {
  ComplaintTemplate,
  CaseStory,
  RTIApplication
};