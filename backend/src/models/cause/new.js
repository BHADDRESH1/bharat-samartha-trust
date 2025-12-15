const mongoose = require('mongoose');

const CauseSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  image: { type: String, required: true },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    default: 'active'
  },
  lastUpdated: { type: String }
});

module.exports = mongoose.model('new', CauseSchema);
