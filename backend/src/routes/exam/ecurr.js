const express = require("express");
const router = express.Router();
const controller = require("../../controllers/exam/ecurr.js");
const uploadController = require("../../controllers/upload.js");

router.post("/upload-image", uploadController.uploadImage);
router.get("/", controller.getItemsByType); // ?type=news | quiz | exam
router.post("/", controller.createItem);
router.put("/:id", controller.updateItem);
router.delete("/:id", controller.deleteItem);

module.exports = router;
