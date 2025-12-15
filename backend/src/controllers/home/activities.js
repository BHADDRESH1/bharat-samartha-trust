// controllers/dailyActivityController.js
const DailyData = require('../../models/home/activitiesModel');

exports.getDailyData = async (req, res) => {
  try {
    const data = await DailyData.findOne();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

exports.saveDailyData = async (req, res) => {
  try {
    const { activities, sectionSettings } = req.body;

    let data = await DailyData.findOne();
    if (data) {
      data.activities = activities;
      data.settings = sectionSettings;
    } else {
      data = new DailyData({ activities, settings: sectionSettings });
    }

    await data.save();
    res.json({ message: 'Data saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save data' });
  }
};
