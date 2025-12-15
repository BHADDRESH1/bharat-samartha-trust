const express = require('express');
const router = express.Router();
const causeController = require('../../controllers/cause/causeList.js');
const uploadController = require('../../controllers/upload.js')

router.get('/', causeController.getCauses);
router.post('/', causeController.addCause);
router.put('/:id', causeController.updateCause);
router.delete('/:id', causeController.deleteCause);
router.post('/upload-image', uploadController.uploadImage);

module.exports = router;
