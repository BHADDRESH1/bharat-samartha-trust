const express = require('express');
const router = express.Router();
const { getSettings, saveSettings } = require('../../controllers/donate/dthank');

router.get('/', getSettings);
router.post('/save', saveSettings);

module.exports = router;
