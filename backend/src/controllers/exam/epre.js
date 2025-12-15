const Paper = require('../../models/exam/epre');
const mongoose = require('mongoose');


// Get all papers
exports.getAllPapers = async (req, res) => {
  try {
    const papers = await Paper.find();
    res.json(papers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
};

// Add new paper
exports.addPaper = async (req, res) => {
  try {
    const newPaper = new Paper(req.body);
    await newPaper.save();
    res.status(201).json(newPaper);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add paper' });
  }
};

// Update a paper
exports.updatePaper = async (req, res) => {
  try {
    const updated = await Paper.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update paper' });
  }
};

// Delete a paper
exports.deletePaper = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Paper ID' });
    }

    const deleted = await Paper.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    res.json({ message: 'Paper deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete paper' });
  }
};

// Bulk update
exports.bulkAction = async (req, res) => {
  const { ids, action } = req.body;
  try {
    if (action === 'delete') {
      await Paper.deleteMany({ _id: { $in: ids } });
      return res.json({ message: 'Papers deleted successfully' });
    }

    if (['Active', 'Inactive'].includes(action)) {
      await Paper.updateMany({ _id: { $in: ids } }, { status: action });
      return res.json({ message: `Papers updated to ${action}` });
    }

    res.status(400).json({ error: 'Invalid action' });
  } catch (err) {
    res.status(500).json({ error: 'Bulk action failed' });
  }
};
