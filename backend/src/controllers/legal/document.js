const { DocumentTemplate, AppSettings } = require('../../models/legal/document');

// Get all templates
exports.getTemplates = async (req, res) => {
  const templates = await DocumentTemplate.find().sort({ lastUpdated: -1 });
  res.json(templates);
};

// Add or update template
exports.saveTemplate = async (req, res) => {
  const { id, ...data } = req.body;

  try {
    const existing = await DocumentTemplate.findOne({ id });
    if (existing) {
      await DocumentTemplate.updateOne({ id }, data);
      return res.json({ message: 'Template updated' });
    } else {
      const newTemplate = new DocumentTemplate({ id, ...data });
      await newTemplate.save();
      return res.json({ message: 'Template created' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to save template', error });
  }
};

// Delete template
exports.deleteTemplate = async (req, res) => {
  try {
    await DocumentTemplate.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Deletion failed' });
  }
};

// Get settings
exports.getSettings = async (req, res) => {
  const settings = await AppSettings.findOne().sort({ createdAt: -1 });
  res.json(settings);
};

// Save or update settings
exports.saveSettings = async (req, res) => {
  try {
    await AppSettings.deleteMany(); // Keep only latest
    const newSettings = new AppSettings(req.body);
    await newSettings.save();
    res.json({ message: 'Settings saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
};

// Optional: Get analytics
exports.getAnalytics = async (req, res) => {
  const templates = await DocumentTemplate.find();
  const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0);
  const averageUsage = templates.length > 0 ? Math.round(totalUsage / templates.length) : 0;
  const activeTemplates = templates.filter(t => t.status === 'active').length;
  const mostUsed = templates.reduce((max, t) => t.usageCount > max.usageCount ? t : max, templates[0] || { usageCount: 0 });

  res.json({
    totalUsage,
    averageUsage,
    activeTemplates,
    mostUsed: mostUsed?.title || 'None'
  });
};


// Toggle template status
exports.toggleTemplateStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const template = await DocumentTemplate.findOne({ id });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    template.status = template.status === 'active' ? 'inactive' : 'active';
    template.lastUpdated = new Date().toISOString().split('T')[0];
    await template.save();

    res.json({ message: 'Status updated', status: template.status });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle status', error });
  }
};
