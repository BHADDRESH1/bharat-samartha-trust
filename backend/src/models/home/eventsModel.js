const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: Number,
  title: String,
  date: String,
  time: String,
  location: String,
  image: String,
  description: String,
  featured: Boolean,
  visible: Boolean,
  registrations: Number,
  maxCapacity: Number,
  category: String
});

const sectionSettingsSchema = new mongoose.Schema({
  sectionVisible: Boolean,
  sectionTitle: String,
  sectionSubtitle: String,
  backgroundGradient: String,
  showOnlyFeatured: Boolean,
  maxEventsToShow: Number,
  showViewAllButton: Boolean,
  viewAllButtonText: String,
  viewAllButtonLink: String
});

const EventSectionSchema = new mongoose.Schema({
  events: [eventSchema],
  sectionSettings: sectionSettingsSchema
});

module.exports = mongoose.model('EventSection', EventSectionSchema);
