const Hero = require('../../models/volunteer/vhero');

// GET hero section
exports.getHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({});
    }
    res.status(200).json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update hero section
exports.updateHero = async (req, res) => {
  try {
    const updated = await Hero.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
