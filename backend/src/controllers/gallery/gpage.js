const { Category, GalleryItem } = require('../../models/gallery/gpage'); // Correct import

// GET all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories', error: err });
  }
};

// CREATE a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create category', error: err });
  }
};

// DELETE a category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category', error: err });
  }
};

// UPDATE a category
exports.updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update category', error: err });
  }
};

// GET all gallery items with populated category
exports.getItems = async (req, res) => {
  try {
    const items = await GalleryItem.find().populate('category');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch gallery items', error: err });
  }
};

// CREATE a new gallery item
exports.createItem = async (req, res) => {
  try {
    const { title, description, category, thumbnail, imageUrl, featured, rotatingGallery, tags } = req.body;
    const item = new GalleryItem({
      title,
      description,
      category,
      thumbnail,
      imageUrl,
      featured,
      rotatingGallery,
      tags
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create item', error: err });
  }
};

// UPDATE a gallery item
exports.updateItem = async (req, res) => {
  try {
    const updated = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update item', error: err });
  }
};

// DELETE a gallery item
exports.deleteItem = async (req, res) => {
  try {
    await GalleryItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item', error: err });
  }
};

// TOGGLE featured status
exports.toggleFeatured = async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.featured = !item.featured;
    await item.save();

    res.json({ message: 'Featured status toggled', featured: item.featured });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle featured status', error: err });
  }
};

// TOGGLE rotatingGallery status
exports.toggleRotatingGallery = async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.rotatingGallery = !item.rotatingGallery;
    await item.save();

    res.json({ message: 'Rotating gallery status toggled', rotatingGallery: item.rotatingGallery });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle rotating gallery status', error: err });
  }
};

