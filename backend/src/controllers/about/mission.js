const MissionVision = require('../../models/about/mission.js');

// GET mission-vision data
exports.getMissionVision = async (req, res) => {
  try {
    let data = await MissionVision.findOne();
    if (!data) {
      data = await MissionVision.create({
        mission: { title: '', content: '', isVisible: true },
        vision: { title: '', content: '', isVisible: true },
        coreValues: []
      });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mission and vision data' });
  }
};

// SAVE or UPDATE mission-vision data
exports.saveMissionVision = async (req, res) => {
  try {
    const newData = req.body;
    let data = await MissionVision.findOne();

    if (data) {
      await MissionVision.updateOne({}, newData);
    } else {
      await MissionVision.create(newData);
    }

    res.status(200).json({ message: 'Mission and Vision saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save mission and vision data' });
  }
};
