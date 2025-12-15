const express = require('express');
const router = express.Router();
const {
  getAllTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleVerified
} = require('../../controllers/volunteer/vtest.js');
const uploadController = require('../../controllers/upload.js')

router.post('/upload-image', uploadController.uploadImage);

router.get('/', getAllTestimonials);
router.post('/', addTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);
router.patch('/verify/:id', toggleVerified);

module.exports = router;
