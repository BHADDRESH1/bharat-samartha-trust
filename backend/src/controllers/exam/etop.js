const TopperStory = require('../../models/exam/etop');

// Get all stories
exports.getAllStories = async (req, res) => {
  try {
    const stories = await TopperStory.find();
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Add new story
exports.createStory = async (req, res) => {
  try {
    const newStory = new TopperStory(req.body);
    const saved = await newStory.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update story
exports.updateStory = async (req, res) => {
  try {
    const updated = await TopperStory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete story
exports.deleteStory = async (req, res) => {
  try {
    await TopperStory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
};
