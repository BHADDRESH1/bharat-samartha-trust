const TimelineItem = require('../../models/about/timeline');

// GET all timeline items (sorted by year)
exports.getAllTimelineItems = async (req, res) => {
  try {
    const items = await TimelineItem.find().sort({ year: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST new timeline item
exports.createTimelineItem = async (req, res) => {
  try {
    const { year, title, description } = req.body;
    const newItem = new TimelineItem({ year, title, description });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: 'Invalid input data' });
  }
};

// PUT update existing item
exports.updateTimelineItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await TimelineItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Item not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating item' });
  }
};

// DELETE item
exports.deleteTimelineItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TimelineItem.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item' });
  }
};
