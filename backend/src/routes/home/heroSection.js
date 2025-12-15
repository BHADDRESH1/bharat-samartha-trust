const express = require("express");
const router = express.Router();
const ctaController = require("../../controllers/home/heroSection");

router.get("/", ctaController.getAllCTASections);
router.post("/", ctaController.saveOrUpdateCTASection);
// Accept PUT as an alias for create/update so clients using PUT won't 404.
router.put("/", ctaController.saveOrUpdateCTASection);

module.exports = router;
