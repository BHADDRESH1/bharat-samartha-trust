const express = require('express');
const router = express.Router();
const paperController = require('../../controllers/exam/epre');
const uploadController = require('../../controllers/uploadFile')

router.post('/upload-image', uploadController.uploadPaperFile);
router.get('/', paperController.getAllPapers);
router.post('/', paperController.addPaper);
router.put('/:id', paperController.updatePaper);
router.delete('/:id', paperController.deletePaper);
router.post('/bulk', paperController.bulkAction);

module.exports = router;
