// controllers/testimonialController.js
const { dTestimonial, TestimonialSettings } = require('../../models/donate/dtest');

exports.saveTestimonial = async (req, res) => {
  const { id, ...data } = req.body;

  try {
    let testimonial;

    if (id) {
      testimonial = await dTestimonial.findByIdAndUpdate(id, data, { new: true });
    } else {
      // Prevent accidental _id conflicts
      if (data._id) {
        delete data._id;
      }

      testimonial = await dTestimonial.create(data);
    }

    res.status(200).json(testimonial);
  } catch (err) {
    console.error('Error saving testimonial:', err);
    res.status(500).json({ error: 'Failed to save testimonial' });
  }
};



// GET all testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await dTestimonial.find().sort({ order: 1 });
    res.status(200).json(testimonials);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

// DELETE testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    await dTestimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
};

// TOGGLE ACTIVE STATUS
exports.toggleActiveStatus = async (req, res) => {
  try {
    const testimonial = await dTestimonial.findById(req.params.id);
    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();
    res.status(200).json(testimonial);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle status' });
  }
};

// SAVE section settings
exports.saveSettings = async (req, res) => {
  try {
    let settings = await TestimonialSettings.findOne();
    if (settings) {
      settings.set(req.body);
      await settings.save();
    } else {
      settings = await TestimonialSettings.create(req.body);
    }
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
};

// GET section settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await TestimonialSettings.findOne();
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};
