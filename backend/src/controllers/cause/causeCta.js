const CtaSection = require('../../models/cause/causeCta');

exports.getCta = async (req, res) => {
  try {
    const cta = await CtaSection.findOne();
    res.json(cta);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch CTA section' });
  }
};

exports.saveCta = async (req, res) => {
  try {
    let cta = await CtaSection.findOne();
    if (!cta) {
      cta = new CtaSection(req.body);
    } else {
      Object.assign(cta, req.body);
    }
    await cta.save();
    res.json({ message: 'CTA section saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save CTA section', details: err.message });
  }
};
