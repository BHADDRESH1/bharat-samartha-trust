const express = require('express');
const router = express.Router();
const controller = require('../../controllers/volunteer/vimpact');

// Get both impact stats and top volunteers
router.get('/', controller.getDashboard);

// Update impact stats
router.put('/stats', controller.updateStats);

// Add a new top volunteer
router.post('/volunteers', controller.addVolunteer);

// Update an existing top volunteer
router.put('/volunteers/:id', controller.updateVolunteer);

// Delete a top volunteer
router.delete('/volunteers/:id', controller.deleteVolunteer);

module.exports = router;
