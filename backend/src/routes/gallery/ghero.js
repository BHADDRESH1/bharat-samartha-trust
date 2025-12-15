const express = require("express");
const router = express.Router();
const {
  saveHeroSettings,
  getHeroSettings,
} = require("../../controllers/gallery/ghero.js");
const uploadController = require("../../controllers/upload.js");
const uploadVideo = require("../../controllers/uploadv.js");

router.get("/", getHeroSettings);
router.post("/save", saveHeroSettings);
router.post("/upload-image", uploadController.uploadImage);
router.post("/upload-video", uploadVideo.uploadVideo);

module.exports = router;
