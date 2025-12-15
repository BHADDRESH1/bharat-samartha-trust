const express = require('express');
const router = express.Router();
const controller = require('../../controllers/legal/property');

const uploadController = require('../../controllers/uploadFile')
router.get('/all-data', controller.getAllData);

router.post('/upload-file', uploadController.uploadPaperFile);
// ---- LEGAL TERMS ----
router.get('/terms', controller.getAllTerms);
router.post('/terms', controller.createTerm);
router.put('/terms/:id', controller.updateTerm);
router.delete('/terms/:id', controller.deleteTerm);

// ---- INHERITANCE RULES ----
router.get('/inheritance', controller.getAllInheritance);
router.post('/inheritance', controller.createInheritance);
router.put('/inheritance/:id', controller.updateInheritance);
router.delete('/inheritance/:id', controller.deleteInheritance);

// ---- LEGAL DOCUMENTS ----
router.get('/documents', controller.getAllDocuments);
router.post('/documents', controller.createDocument);
router.put('/documents/:id', controller.updateDocument);
router.delete('/documents/:id', controller.deleteDocument);

// ---- FARMER RIGHTS ----
router.get('/farmers', controller.getAllFarmers);
router.post('/farmers', controller.createFarmer);
router.put('/farmers/:id', controller.updateFarmer);
router.delete('/farmers/:id', controller.deleteFarmer);

module.exports = router;
