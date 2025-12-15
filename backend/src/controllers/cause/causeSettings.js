const SectionSettings = require('../../models/cause/sectionSetting');

// Get Settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await SectionSettings.findOne();
    if (!settings) {
      settings = await SectionSettings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Settings
exports.updateSettings = async (req, res) => {
  try {
    const updated = await SectionSettings.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
