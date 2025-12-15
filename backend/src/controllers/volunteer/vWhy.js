const WhyVolunteer = require('../../models/volunteer/vWhy');

// GET all settings
exports.getWhyVolunteer = async (req, res) => {
  try {
    let config = await WhyVolunteer.findOne();
    if (!config) {
      config = new WhyVolunteer({
        benefitCards: [],
        sectionSettings: {
          title: '',
          subtitle: '',
          isVisible: true,
          backgroundColor: 'bg-white',
          textAlignment: 'center',
          animationEnabled: true
        }
      });
      await config.save();
    }
    res.status(200).json(config);
  } catch (err) {
    console.error("GET /api/vWhy error:", err); // Add this
    res.status(500).json({ error: err.message });
  }
};


exports.updateWhyVolunteer = async (req, res) => {
  try {
    const { benefitCards, sectionSettings } = req.body;

    // Validate the incoming payload
    if (!Array.isArray(benefitCards) || typeof sectionSettings !== 'object') {
      return res.status(400).json({ error: 'Invalid request body structure' });
    }

    // Sanitize benefitCards - remove any _id fields that might be present
    const sanitizedBenefitCards = benefitCards.map(card => {
      // Create a copy without _id since we disabled _id in schema
      const { _id, ...cardWithoutId } = card;
      return cardWithoutId;
    });

    // Also sanitize sectionSettings if it has _id
    const { _id: sectionId, ...sanitizedSectionSettings } = sectionSettings;

    let config = await WhyVolunteer.findOne();

    if (!config) {
      // Create new document
      config = new WhyVolunteer({ 
        benefitCards: sanitizedBenefitCards, 
        sectionSettings: sanitizedSectionSettings 
      });
    } else {
      // Clear existing arrays to avoid merge issues
      config.benefitCards = [];
      config.sectionSettings = sanitizedSectionSettings;
      
      // Add new benefit cards
      config.benefitCards.push(...sanitizedBenefitCards);
    }

    await config.save();

    res.status(200).json({
      message: 'Updated successfully',
      data: config
    });
  } catch (err) {
    console.error('Error in updateWhyVolunteer:', err);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      details: err.message 
    });
  }
};
