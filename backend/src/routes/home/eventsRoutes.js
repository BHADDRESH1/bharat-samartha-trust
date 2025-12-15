
const express = require('express');

const uploadController = require('../../controllers/upload')
const router = express.Router();
const { getEventSection, saveEventSection } = require('../../controllers/home/eventsController');

router.get('/', getEventSection);
router.put('/', saveEventSection);


router.post('/upload-image', uploadController.uploadImage);

module.exports = router;
