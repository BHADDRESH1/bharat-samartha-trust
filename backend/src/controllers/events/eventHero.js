const HeroBanner = require('../../models/events/eventHero');

// GET config
exports.getHeroBanner = async (req, res) => {
  try {
    let config = await HeroBanner.findOne();
    if (!config) {
      config = await HeroBanner.create({}); // create default if not exists
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching configuration', error });
  }
};

// PUT update config
exports.updateHeroBanner = async (req, res) => {
  try {
    const updatedConfig = await HeroBanner.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true
    });
    res.json(updatedConfig);
  } catch (error) {
    res.status(500).json({ message: 'Error updating configuration', error });
  }
};
