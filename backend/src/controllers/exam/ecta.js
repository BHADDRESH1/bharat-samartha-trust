const CTAContent = require('../../models/exam/ecta');

// Get CTA
exports.getCTAContent = async (req, res) => {
  try {
    const cta = await CTAContent.findOne();
    res.status(200).json(cta);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch CTA content', error });
  }
};

// Save or update CTA
exports.saveCTAContent = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.id; // 🔥 Remove problematic `id` key

    let cta = await CTAContent.findOne();
    if (cta) {
      await CTAContent.updateOne({}, data);
    } else {
      cta = new CTAContent(data);
      await cta.save();
    }

    res.status(200).json({ message: 'CTA content saved successfully' });
  } catch (error) {
    console.error('Error saving CTA:', error);
    res.status(500).json({ message: 'Failed to save CTA content', error });
  }
};

