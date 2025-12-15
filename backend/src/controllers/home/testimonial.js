const Testimonial = require('../../models/home/testimonial');

exports.getTestimonials = async (req, res) => {
  try {
    const data = await Testimonial.find().sort({ dateSubmitted: -1 });
    
    // Return structured response with success flag and data
    res.status(200).json({
      success: true,
      message: 'Testimonials fetched successfully',
      data: data,
      count: data.length
    });
    
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    
    // Return structured error response
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials',
      error: err.message,
      data: []
    });
  }
};

exports.saveTestimonials = async (req, res) => {
  try {
    let testimonials = req.body;

    if (!Array.isArray(testimonials)) {
      return res.status(400).json({ error: 'Input must be an array' });
    }

    // Remove id field to avoid Mongoose trying to cast it as _id
    testimonials = testimonials.map(({ id, ...rest }) => rest);

    await Testimonial.deleteMany({});
    const saved = await Testimonial.insertMany(testimonials);

    res.status(200).json(saved);
  } catch (error) {
    console.error('Save Error:', error);
    res.status(500).json({ error: 'Failed to save testimonials' });
  }
};
