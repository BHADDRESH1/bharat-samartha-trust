const express = require('express');
const router = express.Router();
const donationConfigController = require('../../controllers/donate/dform');

router.get('/get', donationConfigController.getConfig);
router.post('/save', donationConfigController.saveConfig);

module.exports = router;
