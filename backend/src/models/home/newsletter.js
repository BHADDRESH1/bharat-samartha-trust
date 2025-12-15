const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  id: String,
  email: String,
  name: String,
  subscribedAt: String,
  status: String,
  source: String,
  tags: [String]
});

const campaignSchema = new mongoose.Schema({
  id: String,
  subject: String,
  status: String,
  sentAt: String,
  scheduledAt: String,
  recipients: Number,
  openRate: Number,
  clickRate: Number
});

const newsletterSchema = new mongoose.Schema({
  content: {
    title: String,
    subtitle: String,
    description: String,
    placeholderText: String,
    buttonText: String,
    successMessage: String,
    backgroundImage: String,
    backgroundColor: String,
    textColor: String,
    showSocialIcons: Boolean,
    privacyText: String
  },
  subscribers: [subscriberSchema],
  campaigns: [campaignSchema]
});

module.exports = mongoose.model('NewsletterSettings', newsletterSchema);
