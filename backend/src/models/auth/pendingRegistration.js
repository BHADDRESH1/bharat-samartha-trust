const mongoose = require('mongoose');

const pendingRegistrationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 255
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  organization: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1800 // Expires after 30 minutes
  }
});

// Index for email
pendingRegistrationSchema.index({ email: 1 });

// Index for automatic expiration
pendingRegistrationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1800 });

module.exports = mongoose.model('PendingRegistration', pendingRegistrationSchema);