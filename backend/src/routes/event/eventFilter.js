const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/events/eventFilter');

// GET /api/categories?search=term
router.get('/', categoryController.getCategories);

// POST /api/categories
router.post('/', categoryController.addCategory);

// PUT /api/categories/:id
router.put('/:id', categoryController.updateCategory);

// PATCH /api/categories/:id/toggle
router.patch('/:id/toggle', categoryController.toggleCategoryStatus);

// DELETE /api/categories/:id
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
