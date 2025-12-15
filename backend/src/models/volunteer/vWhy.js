const mongoose = require('mongoose');

// Add { _id: false } to disable automatic _id generation for embedded documents
const benefitCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  iconColor: { type: String, required: true },
  bgColor: { type: String, required: true },
  order: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}); // This is the key fix - disables _id for embedded documents

const sectionSettingsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  isVisible: { type: Boolean, default: true },
  backgroundColor: { type: String, default: 'bg-white' },
  textAlignment: {
    type: String,
    enum: ['left', 'center', 'right'],
    default: 'center'
  },
  animationEnabled: { type: Boolean, default: true }
}, { _id: false });

const whyVolunteerSchema = new mongoose.Schema({
  benefitCards: [benefitCardSchema],
  sectionSettings: sectionSettingsSchema
}, { timestamps: true });

module.exports = mongoose.model('WhyVolunteer', whyVolunteerSchema);