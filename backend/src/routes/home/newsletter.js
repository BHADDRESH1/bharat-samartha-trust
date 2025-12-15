const express = require('express');
const router = express.Router();
const newsletterController = require('../../controllers/home/newsletter.js');
const uploadController = require('../../controllers/upload.js');


// Save and fetch routes
router.post('/save',  newsletterController.saveSettings);
router.get('/fetch', newsletterController.getSettings);

// Image upload route
router.post('/upload-image', uploadController.uploadImage);

module.exports = router;
