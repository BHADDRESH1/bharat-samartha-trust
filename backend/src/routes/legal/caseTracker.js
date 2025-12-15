
const uploadController = require('../../controllers/uploadFile')
const express = require('express');
const router = express.Router();
const controller = require('../../controllers/legal/caseTracker');
router.post('/upload-file', uploadController.uploadPaperFile);
// CASE routes
router.get('/cases', controller.getCases);
router.post('/cases', controller.createCase);
router.put('/cases/:id', controller.updateCase);
router.post('/cases/delete', controller.deleteCases);

// USER routes
router.get('/users', controller.getUsers);
router.post('/users', controller.createUser);
router.put('/users/:id', controller.updateUser);
router.post('/users/delete', controller.deleteUsers);

// SETTINGS routes
router.get('/settings', controller.getSettings);
router.post('/settings', controller.saveSettings);

// LOG routes
router.get('/logs', controller.getLogs);
router.post('/logs', controller.createLog);

module.exports = router;


// Case Routes



module.exports = router;
