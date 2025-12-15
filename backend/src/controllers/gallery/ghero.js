const HeroSettings = require('../../models/gallery/ghero');

// Save or update settings
exports.saveHeroSettings = async (req, res) => {
  try {
    const data = req.body;
    let settings = await HeroSettings.findOne();

    if (settings) {
      // Update existing
      settings.set(data);
      await settings.save();
    } else {
      // Create new
      settings = await HeroSettings.create(data);
    }

    res.status(200).json({ message: 'Hero settings saved successfully', settings });
  } catch (error) {
    res.status(500).json({ message: 'Error saving hero settings', error });
  }
};

// Get settings
exports.getHeroSettings = async (req, res) => {
  try {
    const settings = await HeroSettings.findOne();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hero settings', error });
  }
};
