const mongoose = require('mongoose');

const FeatureSchema = new mongoose.Schema({
  id: Number,
  icon: String,
  title: String,
  description: String,
  color: String
}, { _id: false });

const TargetSchema = new mongoose.Schema({
  id: Number,
  task: String,
  completed: Boolean
}, { _id: false });

const RecommendationSchema = new mongoose.Schema({
  id: Number,
  type: String,
  message: String,
  priority: String
}, { _id: false });

const ExamSchema = new mongoose.Schema({
  id: Number,
  name: String,
  date: String,
  daysLeft: Number,
  status: String
}, { _id: false });

const ProgressSchema = new mongoose.Schema({
  name: String,
  score: Number
}, { _id: false });

const SubjectSchema = new mongoose.Schema({
  name: String,
  value: Number
}, { _id: false });

const AdditionalFeaturesSchema = new mongoose.Schema({
  progressData: [ProgressSchema],
  subjectData: [SubjectSchema],
  features: [FeatureSchema],
  dailyTargets: [TargetSchema],
  recommendations: [RecommendationSchema],
  upcomingExams: [ExamSchema],
  timestamp: String
});

module.exports = mongoose.model('AdditionalFeatures', AdditionalFeaturesSchema);
