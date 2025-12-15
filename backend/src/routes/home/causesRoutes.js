const express = require('express');
const router = express.Router();
const controller = require('../../controllers/home/causesController.js');

const uploadController = require('../../controllers/upload.js')

router.get('/', controller.getSection);
router.put('/', controller.updateSection);
router.delete('/reset', controller.resetSection); // Optional for admin reset

router.post('/upload-image', uploadController.uploadImage);
module.exports = router;
