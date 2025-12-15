// routes/studyStepRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../../controllers/exam/eplan');

router.get('/', controller.getAllSteps);
router.post('/', controller.createStep);
router.put('/:id', controller.updateStep);
router.delete('/:id', controller.deleteStep);
router.post('/reorder', controller.reorderSteps); // for drag-drop or up/down move

module.exports = router;
