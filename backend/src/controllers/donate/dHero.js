// controllers/heroBannerSettingsController.js
const HeroBannerSettings = require('../../models/donate/dhero');

// Get the current settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await HeroBannerSettings.findOne().sort({ updatedAt: -1 });
    if (!settings) {
      // Create default settings if not exists
      settings = new HeroBannerSettings({
        title: 'Make an Impact',
        subtitle: 'Every donation brings hope to someone in need.',
        buttonText: 'Donate Now',
        buttonAction: 'scroll',
        buttonLink: '',
        videoUrl: '/videos/donation-impact.mp4',
        videoType: 'local',
        overlayOpacity: 40,
        titleColor: '#ffffff',
        subtitleColor: '#ffffff',
        buttonColor: '#ffffff',
        buttonTextColor: '#7c3aed',
        enableTypewriter: true,
        typewriterSpeed: 3,
        enableScrollIndicator: true,
        maxHeight: 800,
        enableVideoControls: false,
        autoplay: true,
        loop: true,
        muted: true
      });
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get settings' });
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    const updated = await HeroBannerSettings.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
};
