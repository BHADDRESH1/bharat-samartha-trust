const mongoose = require('mongoose');

const reasonSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  iconType: {
    type: String,
    enum: ['shield', 'heart', 'chart', 'check'],
  },
  order: Number,
});

const ctaButtonSchema = new mongoose.Schema({
  id: String,
  text: String,
  href: String,
  type: {
    type: String,
    enum: ['primary', 'secondary', 'tertiary'],
  },
  visible: Boolean,
});

const sectionSchema = new mongoose.Schema({
  mainTitle: String,
  subtitle: String,
  ctaText: String,
  reasons: [reasonSchema],
  ctaButtons: [ctaButtonSchema],
}, { timestamps: true });

module.exports = mongoose.model('WhyChooseUs', sectionSchema);
