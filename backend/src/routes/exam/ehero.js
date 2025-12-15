const express = require("express");
const router = express.Router();
const heroController = require("../../controllers/exam/ehero.js");
const uploadController = require("../../controllers/upload.js");

router.post("/upload-image", uploadController.uploadImage);
router.get("/", heroController.getHeroContent);
router.post("/", heroController.saveHeroContent);

module.exports = router;
