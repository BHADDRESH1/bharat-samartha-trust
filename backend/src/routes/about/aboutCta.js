const express = require('express');
const router = express.Router();
const { getCTA, saveCTA } = require('../../controllers/about/aboutCta.js');
const uploadController = require('../../controllers/upload.js')

router.get('/', getCTA);
router.post('/', saveCTA);
router.post('/upload-image', uploadController.uploadImage);

module.exports = router;
