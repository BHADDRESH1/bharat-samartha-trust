const express = require('express');
const router = express.Router();
const lawController = require('../../controllers/legal/finder');

// Settings routes MUST come first to avoid conflict with parameterized routes
router.get('/set', lawController.getSettings);
router.put('/set', lawController.saveSettings); // Changed from POST to PUT to match frontend

// Law CRUD routes
router.get('/', lawController.getAllLaws);
router.post('/', lawController.createLaw);
router.get('/:id', lawController.getLawById);
router.put('/:id', lawController.updateLaw);
router.delete('/:id', lawController.deleteLaw);

module.exports = router;