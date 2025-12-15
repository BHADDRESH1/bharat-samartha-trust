const express = require("express");
const router = express.Router();
const controller = require("../../controllers/exam/emat.js");

const uploadController = require("../../controllers/uploadFile.js");
const uploadfController = require("../../controllers/upload.js");

router.post("/upload-image", uploadfController.uploadImage);
router.post("/upload-file", uploadController.uploadPaperFile);

router.get("/", controller.getAll);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
