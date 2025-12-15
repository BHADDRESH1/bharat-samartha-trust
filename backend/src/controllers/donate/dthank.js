const ThankYouModal = require('../../models/donate/dthank');

// Get modal settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await ThankYouModal.findOne().sort({ updatedAt: -1 });
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch modal settings.' });
  }
};

// Save or update modal settings
exports.saveSettings = async (req, res) => {
  try {
    const existing = await ThankYouModal.findOne();
    if (existing) {
      await ThankYouModal.findByIdAndUpdate(existing._id, req.body);
      return res.status(200).json({ message: 'Settings updated successfully.' });
    } else {
      await ThankYouModal.create(req.body);
      return res.status(201).json({ message: 'Settings saved successfully.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings.' });
  }
};
