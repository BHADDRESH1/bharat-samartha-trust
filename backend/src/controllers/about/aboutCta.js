const CTASection = require('../../models/about/aboutCta');

// Get CTA
exports.getCTA = async (req, res) => {
  try {
    const cta = await CTASection.findOne();
    res.json(cta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Save/Update CTA
exports.saveCTA = async (req, res) => {
  try {
    const data = req.body;

    let cta = await CTASection.findOne();
    if (cta) {
      await CTASection.updateOne({}, data);
    } else {
      cta = new CTASection(data);
      await cta.save();
    }

    res.status(200).json({ message: 'CTA section saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
