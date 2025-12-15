// routes/aboutHeroRoutes.js
const express = require('express');
const router = express.Router();
const { saveAboutHero, getAboutHero } = require('../../controllers/about/aboutHero.js');
const uploadController = require('../../controllers/upload.js')
const uploadVideo = require('../../controllers/uploadv.js')

router.get('/', getAboutHero);
router.post('/', saveAboutHero);
router.post('/upload-image', uploadController.uploadImage);
router.post('/upload-video', uploadVideo.uploadVideo);

module.exports = router;
