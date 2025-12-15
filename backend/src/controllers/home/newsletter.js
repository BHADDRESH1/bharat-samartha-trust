const NewsletterSettings = require('../../models/home/newsletter');

// Save newsletter settings (content, subscribers, campaigns)
exports.saveSettings = async (req, res) => {
  try {
    const data = req.body;

    let settings = await NewsletterSettings.findOne();
    if (!settings) {
      settings = new NewsletterSettings(data);
    } else {
      settings.set(data);
    }

    await settings.save();
    res.status(200).json({ message: 'Settings saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving settings', error: err.message });
  }
};

// Fetch newsletter settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await NewsletterSettings.findOne();
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching settings', error: err.message });
  }
};
