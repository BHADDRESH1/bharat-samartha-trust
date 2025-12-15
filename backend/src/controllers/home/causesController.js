const FeaturedCauseSection = require('../../models/home/causesModel');

// Get featured causes section
exports.getSection = async (req, res) => {
  try {
    const section = await FeaturedCauseSection.findOne();
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const data = req.body;

    console.log("Received update data:", JSON.stringify(data, null, 2));

    // Convert endDate strings to Date objects
    data.causes = data.causes.map(cause => ({
      ...cause,
      endDate: cause.endDate ? new Date(cause.endDate) : null
    }));

    let section = await FeaturedCauseSection.findOne();

    if (!section) {
      section = new FeaturedCauseSection(data);
    } else {
      section.set(data);
    }

    await section.save();
    res.json(section);
  } catch (err) {
    console.error("🔥 Server error in PUT /api/causes:", err);
    res.status(500).json({ error: err.message });
  }
};



// Reset section (optional utility)
exports.resetSection = async (req, res) => {
  try {
    await FeaturedCauseSection.deleteMany();
    res.json({ message: 'Section reset successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
