const WhyChooseUs = require('../../models/about/aboutChoose');

const getWhyChooseUs = async (req, res) => {
  try {
    const data = await WhyChooseUs.findOne();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

const saveWhyChooseUs = async (req, res) => {
  try {
    const existing = await WhyChooseUs.findOne();

    if (existing) {
      // Update only `reasons` if that's what is coming in req.body
      if (req.body.reasons) {
        existing.reasons = req.body.reasons;
      }

      if (req.body.mainTitle) existing.mainTitle = req.body.mainTitle;
      if (req.body.subtitle) existing.subtitle = req.body.subtitle;
      if (req.body.ctaText) existing.ctaText = req.body.ctaText;
      if (req.body.ctaButtons) existing.ctaButtons = req.body.ctaButtons;

      const updated = await existing.save();
      return res.json(updated);
    } else {
      const created = await WhyChooseUs.create(req.body);
      return res.json(created);
    }
  } catch (err) {
    console.error('Backend error:', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
};


module.exports = {
  getWhyChooseUs,
  saveWhyChooseUs,
};
