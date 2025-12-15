const HeroContent = require('../../models/exam/ehero');

exports.getHeroContent = async (req, res) => {
  try {
    const content = await HeroContent.findOne();
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch hero content', error });
  }
};

exports.saveHeroContent = async (req, res) => {
  try {
    const data = req.body;
    let hero = await HeroContent.findOne();

    if (hero) {
      await HeroContent.updateOne({}, data);
    } else {
      hero = new HeroContent(data);
      await hero.save();
    }

    res.status(200).json({ message: 'Hero content saved successfully' });
  } catch (error) {
    console.error('Hero content save error:', error);
    res.status(500).json({ message: 'Failed to save hero content', error });
  }
};
