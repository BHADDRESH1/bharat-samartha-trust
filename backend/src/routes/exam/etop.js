const express = require('express');
const router = express.Router();
const controller = require('../../controllers/exam/etop.js');
const uploadVideo = require('../../controllers/uploadv.js')
const uploadController = require('../../controllers/upload.js')

router.post('/upload-image', uploadController.uploadImage);
router.post('/upload-video', uploadVideo.uploadVideo);
router.get('/', controller.getAllStories);
router.post('/', controller.createStory);
router.put('/:id', controller.updateStory);
router.delete('/:id', controller.deleteStory);

module.exports = router;
