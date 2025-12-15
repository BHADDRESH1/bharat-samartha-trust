// controllers/studyStepController.js
const StudyStep = require('../../models/exam/eplan');

// GET all
exports.getAllSteps = async (req, res) => {
  try {
    const steps = await StudyStep.find().sort({ order: 1 });
    res.json(steps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch study steps' });
  }
};

// CREATE
exports.createStep = async (req, res) => {
  try {
    const lastStep = await StudyStep.findOne().sort({ order: -1 });
    const order = lastStep ? lastStep.order + 1 : 1;
    const newStep = await StudyStep.create({ ...req.body, order });
    res.status(201).json(newStep);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create step' });
  }
};

// UPDATE
exports.updateStep = async (req, res) => {
  try {
    const updated = await StudyStep.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update step' });
  }
};

// DELETE
exports.deleteStep = async (req, res) => {
  try {
    await StudyStep.findByIdAndDelete(req.params.id);
    res.json({ message: 'Step deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete step' });
  }
};

// REORDER
exports.reorderSteps = async (req, res) => {
  try {
    const { steps } = req.body;
    for (let i = 0; i < steps.length; i++) {
      await StudyStep.findByIdAndUpdate(steps[i].id, { order: i + 1 });
    }
    res.json({ message: 'Reordered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reorder steps' });
  }
};
