const Event = require('../../models/events/eventPage');
const mongoose = require('mongoose');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};


exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    res.status(200).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch event by ID', details: err.message });
  }
};

// CREATE event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      status,
      date,
      time,
      location,
      imageUrl,
      maxAttendees,
      price,
      registrationUrl,
      tags
    } = req.body;

    const event = new Event({
      title,
      description,
      category,
      status,
      date,
      time,
      location,
      imageUrl,
      maxAttendees,
      price,
      registrationUrl,
      tags: typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create event', details: err.message });
  }
};

// UPDATE event
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updateData = req.body;

    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });
    if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });

    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update event', details: err.message });
  }
};

// DELETE event
exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};