const express = require("express");
const router = express.Router();
const galleryController = require("../../controllers/gallery/gpage.js");
const categoryController = require("../../controllers/gallery/gpage.js");
const uploadController = require("../../controllers/upload.js");

router.post("/upload-image", uploadController.uploadImage);
// Gallery Items
router.get("/items", galleryController.getItems);
router.post("/items", galleryController.createItem);
router.put("/items/:id", galleryController.updateItem);
router.delete("/items/:id", galleryController.deleteItem);

// Categories
router.get("/categories", categoryController.getCategories);
router.post("/categories", categoryController.createCategory);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

module.exports = router;
