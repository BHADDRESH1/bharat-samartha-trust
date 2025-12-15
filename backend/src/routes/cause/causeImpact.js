const express = require('express');
const router = express.Router();
const { getImpact, saveImpact } = require('../../controllers/cause/causeImpact');

router.get('/', getImpact);
router.post('/save', saveImpact);

module.exports = router;
