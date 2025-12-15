// routes/heroBannerSettingsRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../../controllers/donate/dHero.js');
const uploadVideo = require('../../controllers/uploadv.js')

router.post('/upload-video', uploadVideo.uploadVideo);
// GET and PUT
router.get('/', controller.getSettings);
router.put('/', controller.updateSettings);

module.exports = router;
