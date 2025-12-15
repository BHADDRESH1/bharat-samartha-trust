const TransformProject = require('../../models/cause/project');

// Get all
exports.getProjects = async (req, res) => {
  try {
    const projects = await TransformProject.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new
exports.createProject = async (req, res) => {
  try {
    const newProject = new TransformProject(req.body);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update
exports.updateProject = async (req, res) => {
  try {
    const updated = await TransformProject.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deleteProject = async (req, res) => {
  try {
    await TransformProject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Toggle Active
exports.toggleActive = async (req, res) => {
  try {
    const project = await TransformProject.findById(req.params.id);
    project.isActive = !project.isActive;
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
