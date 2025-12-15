const express = require('express');
const router = express.Router();
const ctaController = require('../../controllers/home/ctaController');

// GET CTA Section
router.get('/cta/:id', ctaController.getCTASection);

// POST - Save CTA Section
router.post('/save', ctaController.saveCTASection);

// PUT - Update CTA Section
router.post('/', ctaController.updateCTASection);

module.exports = router;
