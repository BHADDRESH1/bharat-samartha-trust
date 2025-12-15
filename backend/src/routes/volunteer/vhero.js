const express = require('express');
const router = express.Router();
const { getHero, updateHero } = require('../../controllers/volunteer/vhero.js');
const uploadVideo = require('../../controllers/uploadv.js')

// API routes
router.get('/', getHero);
router.put('/', updateHero);
router.post('/upload-video', uploadVideo.uploadVideo);

// Optional video upload


module.exports = router;
