const AdditionalFeatures = require('../../models/exam/eadd');

exports.saveFeaturesData = async (req, res) => {
  try {
    const existing = await AdditionalFeatures.findOne();
    if (existing) await AdditionalFeatures.deleteMany();

    const saved = await AdditionalFeatures.create(req.body);
    res.status(201).json(saved);
  } catch (err) {
    console.error('SAVE ERROR:', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
};

exports.getFeaturesData = async (req, res) => {
  try {
    const data = await AdditionalFeatures.findOne();
    res.status(200).json(data || {});
  } catch (err) {
    console.error('FETCH ERROR:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
