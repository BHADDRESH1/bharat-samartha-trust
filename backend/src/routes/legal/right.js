const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/legal/right');

// Templates
router.get('/templates', ctrl.getTemplates);
router.post('/templates', ctrl.saveTemplate);
router.delete('/templates/:id', ctrl.deleteTemplate);
// Toggle Template Status
router.patch('/templates/:id/toggle', ctrl.toggleTemplateStatus);
// Save/update template by ID
router.put('/templates/:id', ctrl.saveTemplate);

// Save/update case by ID
router.put('/cases/:id', ctrl.saveCase);

// Toggle Case Public Visibility
router.patch('/cases/:id/toggle', ctrl.toggleCaseVisibility);

// Case Stories
router.get('/cases', ctrl.getCases);
router.post('/cases', ctrl.saveCase);
router.delete('/cases/:id', ctrl.deleteCase);

// RTI Applications
router.get('/rtis', ctrl.getRTIs);
router.post('/rtis', ctrl.saveRTI);
router.delete('/rtis/:id', ctrl.deleteRTI);
router.patch('/rtis/:id/status', ctrl.updateRTIStatus);

module.exports = router;
