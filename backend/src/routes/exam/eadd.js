const express = require('express');
const router = express.Router();
const controller = require('../../controllers/exam/eadd');

router.get('/', controller.getFeaturesData);
router.post('/save', controller.saveFeaturesData);

module.exports = router;
