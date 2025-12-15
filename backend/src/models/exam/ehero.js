const mongoose = require('mongoose');

const floatingShapeSchema = new mongoose.Schema({
  enabled: Boolean,
  minWidth: Number,
  maxWidth: Number,
  minHeight: Number,
  maxHeight: Number,
  opacity: Number,
  color: String,
  shape: {
    type: String,
    enum: ['circle', 'square', 'triangle']
  }
}, { _id: false });

const heroContentSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  primaryButtonText: String,
  primaryButtonLink: String,
  secondaryButtonText: String,
  secondaryButtonLink: String,
  backgroundGradientFrom: String,
  backgroundGradientTo: String,
  titleEmoji: String,
  subtitleEmoji: String,
  backgroundImage: String,
  useBackgroundImage: Boolean,

  floatingShape: floatingShapeSchema
}, { timestamps: true });

module.exports = mongoose.model('HeroContent', heroContentSchema);
