const mongoose = require('mongoose');

const ButtonSchema = new mongoose.Schema({
  id: Number, // 👈 add this line to accept numeric ids
  text: String,
  href: String,
  type: { type: String, enum: ['primary', 'secondary'], default: 'secondary' },
  isVisible: { type: Boolean, default: true },
}, { _id: false }); // 👈 very important: disable automatic _id for subdocuments


const CtaSchema = new mongoose.Schema({
  title: String,
  description: String,
  backgroundColor: String,
  textColor: String,
  isVisible: { type: Boolean, default: true },
  animation: {
    enabled: { type: Boolean, default: true },
    duration: Number,
    delay: Number,
  },
  layout: { type: String, enum: ['center', 'left', 'right'], default: 'center' },
  spacing: { type: String, enum: ['compact', 'normal', 'relaxed'], default: 'normal' },
  buttons: [ButtonSchema]
}, { timestamps: true });

module.exports = mongoose.model('causecta', CtaSchema);
