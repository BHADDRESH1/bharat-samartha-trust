const StatsSection = require('../../models/home/statsModel');

exports.getStatsSection = async (req, res) => {
  try {
    const section = await StatsSection.findOne();
    res.json(section || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats section.' });
  }
};

exports.saveStatsSection = async (req, res) => {
  try {
    const data = req.body;
    const updated = await StatsSection.findOneAndUpdate({}, data, {
      upsert: true,
      new: true
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save stats section.' });
  }
};
