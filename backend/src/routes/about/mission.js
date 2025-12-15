const express = require('express');
const router = express.Router();
const controller = require('../../controllers/about/mission.js');

router.get('/', controller.getMissionVision);
router.post('/', controller.saveMissionVision);

module.exports = router;
