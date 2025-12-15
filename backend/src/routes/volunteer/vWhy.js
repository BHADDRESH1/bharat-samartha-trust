const express = require('express');
const router = express.Router();
const {
  getWhyVolunteer,
  updateWhyVolunteer
} = require('../../controllers/volunteer/vWhy');

// @route   GET /api/why-volunteer
router.get('/', getWhyVolunteer);

// @route   PUT /api/why-volunteer
router.put('/', updateWhyVolunteer);

module.exports = router;
