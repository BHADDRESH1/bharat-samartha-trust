import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  isMonthly: {
    type: Boolean,
    default: false
  },
  donor: {
    name: String,
    email: String,
    phone: String,
    isAnonymous: {
      type: Boolean,
      default: false
    },
    message: String
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet'],
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Donation', DonationSchema);
