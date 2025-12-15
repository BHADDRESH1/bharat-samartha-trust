const express = require('express');
const router = express.Router();
const ctaController = require('../../controllers/exam/ecta');

router.get('/', ctaController.getCTAContent);
router.post('/', ctaController.saveCTAContent);

module.exports = router;
