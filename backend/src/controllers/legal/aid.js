const { Helpline, LegalAidCenter, SupportResource } = require('../../models/legal/aid');

// Generic CRUD
exports.getAllData = async (req, res) => {
  try {
    const helplines = await Helpline.find();
    const centers = await LegalAidCenter.find();
    const resources = await SupportResource.find();
    res.json({ helplines, centers, resources });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helplines
exports.createHelpline = async (req, res) => {
  try {
    const helpline = new Helpline(req.body);
    await helpline.save();
    res.json(helpline);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateHelpline = async (req, res) => {
  try {
    const updated = await Helpline.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteHelpline = async (req, res) => {
  try {
    await Helpline.findByIdAndDelete(req.params.id);
    res.json({ message: 'Helpline deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Centers
exports.createCenter = async (req, res) => {
  try {
    const center = new LegalAidCenter(req.body);
    await center.save();
    res.json(center);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCenter = async (req, res) => {
  try {
    const updated = await LegalAidCenter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCenter = async (req, res) => {
  try {
    await LegalAidCenter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Center deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Resources
// Resource create controller
exports.createResource = async (req, res) => {
  try {
    const { title, category, type, size, fileUrl, videoUrl, isActive } = req.body;

    if (!title || !category || !type || (!fileUrl && !videoUrl)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newResource = new SupportResource({
      title,
      category,
      type,
      size,
      fileUrl,
      videoUrl,
      isActive,
      lastUpdated: new Date().toISOString().split('T')[0]
    });

    await newResource.save();
    res.status(201).json(newResource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateResource = async (req, res) => {
  try {
    console.log('Update Resource body:', req.body);
    const updated = await SupportResource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteResource = async (req, res) => {
  try {
    await SupportResource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Toggle isActive status
exports.toggleStatus = async (req, res) => {
  const { type, id } = req.params;

  let Model;
  if (type === 'helpline') Model = require('../../models/legal/aid').Helpline;
  else if (type === 'center') Model = require('../../models/legal/aid').LegalAidCenter;
  else if (type === 'resource') Model = require('../../models/legal/aid').SupportResource;
  else return res.status(400).json({ error: 'Invalid type' });

  try {
    const item = await Model.findById(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.isActive = !item.isActive;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
