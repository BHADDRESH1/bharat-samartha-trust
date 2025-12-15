// controllers/aboutHeroController.js
const AboutHero = require('../../models/about/aboutHero');
const { executeWithFallback } = require('../../utils/dbHelpers');

// Save or Update About Hero
exports.saveAboutHero = async (req, res) => {
  try {
    const data = req.body;

    const result = await executeWithFallback(
      async () => {
        let hero = await AboutHero.findOne();
        if (hero) {
          await AboutHero.updateOne({}, data);
        } else {
          hero = await AboutHero.create(data);
        }
        return hero;
      },
      null,
      'Save About Hero'
    );

    res.status(200).json({ message: 'About Hero section saved successfully', data: result });
  } catch (err) {
      console.error('Error saving hero:', err);
      res.status(500).json({ message: 'Server error while saving hero section' });
  }
};

// Get About Hero
exports.getAboutHero = async (req, res) => {
  try {
    const hero = await executeWithFallback(
      async () => await AboutHero.findOne(),
      {
        // Default fallback data for demo mode
        title: "About Our Organization",
        subtitle: "Making a difference in communities worldwide",
        description: "We are dedicated to creating positive change through innovative solutions and community engagement.",
        imageUrl: "/images/about-hero-default.jpg",
        ctaText: "Learn More",
        ctaUrl: "/about"
      },
      'Get About Hero'
    );
    
    res.status(200).json(hero);
  } catch (err) {
    console.error('Error fetching hero:', err);
    // Return default data even if there's an error
    res.status(200).json({
      title: "About Our Organization",
      subtitle: "Making a difference in communities worldwide",
      description: "We are dedicated to creating positive change through innovative solutions and community engagement.",
      imageUrl: "/images/about-hero-default.jpg",
      ctaText: "Learn More",
      ctaUrl: "/about"
    });
  }
};