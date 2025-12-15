const express = require('express');
const router = express.Router();
const { getImpactMeter, saveImpactMeter } = require('../../controllers/donate/dimpact.js');

router.get('/', getImpactMeter);
router.post('/save', saveImpactMeter);

module.exports = router;
