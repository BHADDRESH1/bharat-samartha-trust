const express = require('express');
const router = express.Router();
const testimonialController = require('../../controllers/home/testimonial.js');

router.get('/', testimonialController.getTestimonials);
router.post('/save', testimonialController.saveTestimonials);

module.exports = router;
