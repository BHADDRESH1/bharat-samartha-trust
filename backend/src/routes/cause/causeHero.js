const express = require('express');
const router = express.Router();
const {
  getHeroBanner,
  saveHeroBanner
} = require('../../controllers/cause/causeHero.js');
const uploadController = require('../../controllers/upload.js')
const uploadVideo = require('../../controllers/uploadv.js')

router.get('/', getHeroBanner);
router.post('/save', saveHeroBanner);
router.post('/upload-image', uploadController.uploadImage);
router.post('/upload-video', uploadVideo.uploadVideo);

module.exports = router;
