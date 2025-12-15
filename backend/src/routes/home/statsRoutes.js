const express = require('express');
const router = express.Router();
const { getStatsSection, saveStatsSection } = require('../../controllers/home/statsController');

router.get('/stats', getStatsSection);
router.post('/', saveStatsSection);

module.exports = router;
