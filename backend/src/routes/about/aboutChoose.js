const express = require('express');
const router = express.Router();
const {
  getWhyChooseUs,
  saveWhyChooseUs,
} = require('../../controllers/about/aboutWhyChoose');

router.get('/', getWhyChooseUs);
router.post('/', saveWhyChooseUs);

module.exports = router;
