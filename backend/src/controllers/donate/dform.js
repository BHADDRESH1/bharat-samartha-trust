const DonationConfig = require('../../models/donate/dform');

// Save or Update Donation Config
exports.saveConfig = async (req, res) => {
  try {
    const existing = await DonationConfig.findOne();

    if (existing) {
      await DonationConfig.findByIdAndUpdate(existing._id, req.body);
      res.status(200).json({ message: 'Donation configuration updated successfully.' });
    } else {
      await DonationConfig.create(req.body);
      res.status(201).json({ message: 'Donation configuration created successfully.' });
    }
  } catch (error) {
    console.error('Error saving config:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get Donation Config
exports.getConfig = async (req, res) => {
  try {
    const config = await DonationConfig.findOne();
    res.status(200).json(config || {});
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
