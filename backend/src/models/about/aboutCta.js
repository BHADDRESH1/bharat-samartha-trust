const mongoose = require('mongoose');

const ctaButtonSchema = new mongoose.Schema({
  id: String,
  text: String,
  href: String,
  style: { type: String, enum: ['primary', 'secondary'] },
  visible: Boolean,
  order: Number,
});

const animationSchema = new mongoose.Schema({
  enabled: Boolean,
  titleDelay: Number,
  descriptionDelay: Number,
  buttonsDelay: Number,
  duration: Number,
});

const ctaSectionSchema = new mongoose.Schema({
  mainTitle: String,
  description: String,
  backgroundType: { type: String, enum: ['gradient', 'solid', 'image'] },
  gradientFrom: String,
  gradientTo: String,
  solidColor: String,
  backgroundImage: String,
  textColor: String,
  padding: { type: String, enum: ['small', 'medium', 'large'] },
  buttons: [ctaButtonSchema],
  animation: animationSchema,
}, { timestamps: true });

module.exports = mongoose.model('CTASection', ctaSectionSchema);
