const ImpactMeter = require('../../models/donate/dimpact');

exports.getImpactMeter = async (req, res) => {
  try {
    const data = await ImpactMeter.findOne().sort({ updatedAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

exports.saveImpactMeter = async (req, res) => {
  try {
    const { impactStats, monthlyGoal, settings } = req.body;

    let data = await ImpactMeter.findOne();
    if (data) {
      data.impactStats = impactStats;
      data.monthlyGoal = monthlyGoal;
      data.settings = settings;
      await data.save();
    } else {
      data = await ImpactMeter.create({ impactStats, monthlyGoal, settings });
    }

    res.status(200).json({ message: 'Impact meter saved successfully', data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save data' });
  }
};
