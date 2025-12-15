const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const impactController = require('../../controllers/home/impact');
const uploadController = require('../../controllers/upload')


// Routes
router.get('/', impactController.getImpact);
router.put('/', impactController.updateImpact);
router.post('/upload-image', uploadController.uploadImage);


module.exports = router;
