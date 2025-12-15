const EventSection = require('../../models/home/eventsModel');

// GET all data
const getEventSection = async (req, res) => {
  try {
    let data = await EventSection.findOne();
    if (!data) {
      data = await EventSection.create({
        events: [],
        sectionSettings: {
          sectionVisible: true,
          sectionTitle: 'Upcoming Events',
          sectionSubtitle: '',
          backgroundGradient: 'from-blue-50 to-white',
          showOnlyFeatured: true,
          maxEventsToShow: 3,
          showViewAllButton: true,
          viewAllButtonText: 'View All Events',
          viewAllButtonLink: '/events'
        }
      });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event section' });
  }
};

// SAVE or UPDATE data
const saveEventSection = async (req, res) => {
  try {
    const { events, sectionSettings } = req.body;
    let data = await EventSection.findOne();

    if (data) {
      data.events = events;
      data.sectionSettings = sectionSettings;
      await data.save();
    } else {
      data = await EventSection.create({ events, sectionSettings });
    }

    res.json({ message: 'Event section saved', data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save event section' });
  }
};

module.exports = {
  getEventSection,
  saveEventSection
};
