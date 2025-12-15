const Cause = require('../../models/cause/new');

const createCause = async (req, res) => {
  try {
    const {
      title, description, category, goalAmount, image, status
    } = req.body;

    const id = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);

    const newCause = new Cause({
      id,
      title,
      description,
      category,
      goalAmount,
      image,
      status,
      lastUpdated: new Date().toISOString().split('T')[0]
    });

    await newCause.save();
    res.status(201).json({ message: 'Cause created successfully', data: newCause });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create cause', error: err.message });
  }
};

module.exports = { createCause };
