// routes/testimonialRoutes.js
const express = require("express");
const router = express.Router();
const testimonialController = require("../../controllers/donate/dtest.js");
const uploadController = require("../../controllers/upload.js");

router.post("/upload-image", uploadController.uploadImage);
// Testimonials
router.get("/", testimonialController.getTestimonials);
router.post("/save", testimonialController.saveTestimonial);
router.delete("/:id", testimonialController.deleteTestimonial);
router.patch("/toggle/:id", testimonialController.toggleActiveStatus);

// Section Settings
router.get("/settings", testimonialController.getSettings);
router.post("/settings", testimonialController.saveSettings);

module.exports = router;
