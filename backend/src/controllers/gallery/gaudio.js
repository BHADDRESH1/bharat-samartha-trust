const AudioConfig = require('../../models/gallery/gaudio');

// GET - Fetch entire audio config
exports.getAudioConfig = async (req, res) => {
  try {
    let config = await AudioConfig.findOne();

    // If not found, create default config
    if (!config) {
      config = new AudioConfig({
        audioTracks: [],
        globalMuted: false,
        globalAutoPlay: true,
        globalVolume: 0.7,
        backgroundMusic: {
          enabled: true,
          track: '',
          volume: 0.5,
          fadeIn: true,
          fadeOut: true,
          loop: true
        },
        soundEffects: {
          enabled: true,
          volume: 0.8,
          hoverSound: '',
          clickSound: '',
          transitionSound: ''
        },
        controlsVisibility: {
          showPlayPause: true,
          showVolumeControl: true,
          showAutoPlayToggle: true,
          showOnMobile: false,
          position: 'bottom-right'
        }
      });
      await config.save();
    }

    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audio config' });
  }
};

// PUT - Save/update audio config
exports.saveAudioConfig = async (req, res) => {
  try {
    const updatedConfig = await AudioConfig.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );

    res.status(200).json(updatedConfig);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save audio config' });
  }
};
