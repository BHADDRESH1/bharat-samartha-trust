const express = require('express');
const router = express.Router();
const {
  getAllFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  toggleFAQStatus
} = require('../../controllers/volunteer/vFaq.js');
const uploadController = require('../../controllers/upload.js')

router.post('/upload-image', uploadController.uploadImage);
router.get('/', getAllFAQs);
router.post('/', createFAQ);
router.put('/:id', updateFAQ);
router.delete('/:id', deleteFAQ);
router.patch('/:id/status', toggleFAQStatus);

module.exports = router;
