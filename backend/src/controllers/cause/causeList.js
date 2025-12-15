const Cause = require('../../models/cause/new');

// Get all causes
exports.getCauses = async (req, res) => {
  try {
    const causes = await Cause.find();
    res.json(causes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new cause
exports.addCause = async (req, res) => {
  try {
    const newCause = new Cause({
      ...req.body,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    await newCause.save();
    res.status(201).json(newCause);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update existing cause
exports.updateCause = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Cause.findByIdAndUpdate(
      id,
      { ...req.body, lastUpdated: new Date().toISOString().split('T')[0] },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a cause
exports.deleteCause = async (req, res) => {
  try {
    const { id } = req.params;
    await Cause.findByIdAndDelete(id);
    res.json({ message: 'Cause deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
