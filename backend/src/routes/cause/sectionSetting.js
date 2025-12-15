const express = require('express');
const router = express.Router();
const controller = require('../../controllers/cause/causeSettings');

router.get('/', controller.getSettings);
router.put('/', controller.updateSettings);

module.exports = router;
