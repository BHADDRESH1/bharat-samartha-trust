const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Draft','Cancelled','Completed','completed','cancelled','active','draft'], default: 'Active' },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // optional: consider using full ISO datetime
  location: {
    name: String,
    address: String,
    city: String,
    state: String,
    zip: String
  },
  imageUrl: { type: String, default: '' },
  maxAttendees: { type: Number, default: 0 },
  price: { type: Number, default: 0.00 },
  registrationUrl: { type: String, default: '' },
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
