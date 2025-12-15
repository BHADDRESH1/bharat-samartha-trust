const express = require('express');
const router = express.Router();
const controller = require('../../controllers/events/eventHero.js');
const uploadVideo = require('../../controllers/uploadv.js')

router.post('/upload-video', uploadVideo.uploadVideo);
router.get('/', controller.getHeroBanner);
router.put('/', controller.updateHeroBanner);

module.exports = router;
