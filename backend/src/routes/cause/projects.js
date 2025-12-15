const express = require("express");
const router = express.Router();
const controller = require("../../controllers/cause/causeprojects.js");
const uploadController = require("../../controllers/upload.js");

router.get("/", controller.getProjects);
router.post("/", controller.createProject);
router.put("/:id", controller.updateProject);
router.delete("/:id", controller.deleteProject);
router.patch("/toggle/:id", controller.toggleActive);
router.post("/upload-image", uploadController.uploadImage);

module.exports = router;
