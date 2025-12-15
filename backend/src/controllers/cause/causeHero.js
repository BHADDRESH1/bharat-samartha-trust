// backend/controllers/heroBannerController.js
const HeroBanner = require('../../models/cause/causeHero');

exports.getHeroBanner = async (req, res) => {
  try {
    const banner = await HeroBanner.findOne();
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hero banner data.' });
  }
};

exports.saveHeroBanner = async (req, res) => {
  try {
    const existing = await HeroBanner.findOne();
    if (existing) {
      await HeroBanner.updateOne({}, req.body);
    } else {
      await HeroBanner.create(req.body);
    }
    res.json({ success: true, message: 'Hero banner saved.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save hero banner data.' });
  }
};