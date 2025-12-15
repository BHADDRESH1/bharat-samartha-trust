const express = require('express');
const router = express.Router();
const controller = require('../../controllers/legal/document');

router.get('/templates', controller.getTemplates);
router.post('/templates', controller.saveTemplate);
router.put('/templates/:id', controller.saveTemplate);
router.delete('/templates/:id', controller.deleteTemplate);

router.get('/settings', controller.getSettings);
router.put('/settings', controller.saveSettings);

// Optional analytics
router.get('/analytics', controller.getAnalytics);
router.patch('/templates/:id/toggle-status', controller.toggleTemplateStatus);


module.exports = router;
