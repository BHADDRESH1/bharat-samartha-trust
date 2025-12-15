const mongoose = require('mongoose');

const CoreValueSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  icon: String
}, { _id: false });

const MissionVisionSchema = new mongoose.Schema({
  mission: {
    title: String,
    content: String,
    isVisible: Boolean
  },
  vision: {
    title: String,
    content: String,
    isVisible: Boolean
  },
  coreValues: [CoreValueSchema]
}, { timestamps: true });

module.exports = mongoose.model('MissionVision', MissionVisionSchema);
