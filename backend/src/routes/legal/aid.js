const express = require("express");
const router = express.Router();
const controller = require("../../controllers/legal/aid.js");

const uploadController = require("../../controllers/uploadFile.js");
const uploadfController = require("../../controllers/uploadv.js");

router.post("/upload-video", uploadfController.uploadVideo);
router.post("/upload-file", uploadController.uploadPaperFile);
// All Data
router.get("/all", controller.getAllData);

// Helpline Routes
router.post("/helpline", controller.createHelpline);
router.put("/helpline/:id", controller.updateHelpline);
router.delete("/helpline/:id", controller.deleteHelpline);

// Center Routes
router.post("/center", controller.createCenter);
router.put("/center/:id", controller.updateCenter);
router.delete("/center/:id", controller.deleteCenter);

// Resource Routes
router.post("/resource", controller.createResource);
router.put("/resource/:id", controller.updateResource);
router.delete("/resource/:id", controller.deleteResource);

router.patch("/toggle/:type/:id", controller.toggleStatus);

module.exports = router;
