const StudyMaterial = require('../../models/exam/emat');

// GET all materials
exports.getAll = async (req, res) => {
  try {
    const materials = await StudyMaterial.find();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
};

// CREATE material
exports.create = async (req, res) => {
  try {
    const { title, category, type, subject, rating, downloads, description, fileSize, status } = req.body;

    const material = new StudyMaterial({
      title,
      category,
      type,
      subject,
      thumbnail: req.files?.thumbnail?.[0]?.path || '',
      downloadUrl: req.files?.material?.[0]?.path || '',
      rating,
      downloads,
      description,
      fileSize,
      status,
      date: new Date().toISOString().split('T')[0]
    });

    const saved = await material.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating material:', err);
    res.status(500).json({ error: 'Failed to create material' });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = { ...req.body };

    if (req.files?.thumbnail?.[0]) updates.thumbnail = req.files.thumbnail[0].path;
    if (req.files?.material?.[0]) updates.downloadUrl = req.files.material[0].path;

    const updated = await StudyMaterial.findByIdAndUpdate(id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update material' });
  }
};

// DELETE
exports.delete = async (req, res) => {
  try {
    await StudyMaterial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};
