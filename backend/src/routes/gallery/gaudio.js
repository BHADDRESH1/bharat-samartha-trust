const express = require('express');
const router = express.Router();
const { getAudioConfig, saveAudioConfig } = require('../../controllers/gallery/gaudio');
const audio = require('../../controllers/uploada')

// Routes
router.get('/', getAudioConfig);
router.put('/', saveAudioConfig);
router.post('/upload-audio',audio.uploadAudio)

module.exports = router;
