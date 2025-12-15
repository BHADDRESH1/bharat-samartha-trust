const Partner = require('../../models/volunteer/vTrust');

// GET all partners + metrics
exports.getAll = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });

    const trustMetrics = {
      total_partners: partners.length,
      verified_partners: partners.filter(p => p.status === 'active').length,
      transparency_score: 94,
      impact_reports_published: 4,
      certification_level: 'Gold'
    };

    res.json({ partners, trustMetrics });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching data' });
  }
};

// ADD new partner
exports.addPartner = async (req, res) => {
  try {
    console.log('Incoming partner data:', req.body); // ✅ Debug log

    const newPartner = new Partner(req.body.partner);
    await newPartner.save();

    const partners = await Partner.find().sort({ createdAt: -1 });
    res.json({ message: 'Partner added', partners });
  } catch (err) {
    console.error('❌ Failed to add partner:', err); // ✅ Error log
    res.status(500).json({ error: 'Failed to add partner' });
  }
};


// UPDATE partner
exports.updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    await Partner.findByIdAndUpdate(id, req.body.partner);

    const partners = await Partner.find().sort({ createdAt: -1 });
    res.json({ message: 'Partner updated', partners });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update partner' });
  }
};

// DELETE partner
exports.deletePartner = async (req, res) => {
  try {
    const { id } = req.params;
    await Partner.findByIdAndDelete(id);

    const partners = await Partner.find().sort({ createdAt: -1 });
    res.json({ message: 'Partner deleted', partners });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete partner' });
  }
};
