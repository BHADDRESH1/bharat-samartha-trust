const express = require('express');
const router = express.Router();

const controller = require('../../controllers/legal/legalsec');
const uploadController = require('../../controllers/uploadFile'); // if you have this



// Uploads
router.post('/upload-file', uploadController.uploadPaperFile); // only if this controller is defined

// Rights
router.get('/rights', controller.getRights);
router.post('/rights', controller.addRight);
router.put('/rights/:id', controller.updateRight);
router.delete('/rights/:id', controller.deleteRight);

// Schemes
router.get('/schemes', controller.getSchemes);
router.post('/schemes', controller.addScheme);
router.put('/schemes/:id', controller.updateScheme);
router.delete('/schemes/:id', controller.deleteScheme);

// Resources
router.get('/resources', controller.getResources);
router.post('/resources', controller.addResource);
router.put('/resources/:id', controller.updateResource);
router.delete('/resources/:id', controller.deleteResource);

module.exports = router;
