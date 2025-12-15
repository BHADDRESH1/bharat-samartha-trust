const { Case } = require('../../models/legal/caseTracker');
const { ComplaintTemplate, CaseStory, RTIApplication } = require('../../models/legal/right');

exports.getTemplates = async (req, res) => {
  try {
    const templates = await ComplaintTemplate.find(); // removed type filter
    res.json(templates);
  } catch (err) {
    console.error('Error fetching templates:', err);
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
};

// GET all Case Stories
exports.getCases = async (req, res) => {
  try {
    const cases = await CaseStory.find(); // removed type filter
    res.json(cases);
  } catch (err) {
    console.error('Error fetching cases:', err);
    res.status(500).json({ message: 'Failed to fetch case stories' });
  }
};

// GET all RTI Applications
exports.getRTIs = async (req, res) => {
  try {
    const rtis = await RTIApplication.find(); // removed type filter
    res.json(rtis);
  } catch (err) {
    console.error('Error fetching RTIs:', err);
    res.status(500).json({ message: 'Failed to fetch RTI applications' });
  }
};
// ---- Complaint Templates ----


exports.saveTemplate = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    if (id) {
      const updated = await ComplaintTemplate.findByIdAndUpdate(id, data, { new: true });
      if (!updated) return res.status(404).send('Template not found');
      return res.json(updated);
    } else {
      const newTemplate = new ComplaintTemplate({ ...data });
      const saved = await newTemplate.save();
      res.json(saved);
    }
  } catch (error) {
    console.error('Error saving template:', error);
    res.status(500).json({ message: 'Failed to save template' });
  }
};


exports.toggleTemplateStatus = async (req, res) => {
  try {
    const template = await ComplaintTemplate.findById(req.params.id);
    if (!template) return res.status(404).send('Template not found');

    template.status = template.status === 'active' ? 'inactive' : 'active';
    await template.save();
    res.json(template);
  } catch (error) {
    console.error('Error toggling template status:', error);
    res.status(500).send('Server error');
  }
};



exports.deleteTemplate = async (req, res) => {
  await ComplaintTemplate.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

// ---- Case Stories ----


exports.saveCase = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    if (id) {
      const updated = await CaseStory.findByIdAndUpdate(id, data, { new: true });
      if (!updated) return res.status(404).send('Case not found');
      return res.json(updated);
    } else {
      const newCase = new CaseStory({ ...data });
      const saved = await newCase.save();
      res.json(saved);
    }
  } catch (error) {
    console.error('Error saving case:', error);
    res.status(500).json({ message: 'Failed to save case' });
  }
};


exports.deleteCase = async (req, res) => {
  await CaseStory.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

exports.toggleCaseVisibility = async (req, res) => {
  const caseStory = await CaseStory.findById(req.params.id);
  if (!caseStory || caseStory.type !== 'case') return res.status(404).send('Case story not found');
  caseStory.isPublic = !caseStory.isPublic;
  await caseStory.save();
  res.json(caseStory);
};

// ---- RTI Applications ----


exports.saveRTI = async (req, res) => {
  const { id, ...data } = req.body;
  if (id) {
    const updated = await RTIApplication.findByIdAndUpdate(id, data, { new: true });
    return res.json(updated);
  }
  const newRTI = new RTIApplication({ ...data, type: 'rti' });
  const saved = await newRTI.save();
  res.json(saved);
};

exports.deleteRTI = async (req, res) => {
  await RTIApplication.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

exports.updateRTIStatus = async (req, res) => {
  const { status } = req.body;
  const updated = await RTIApplication.findByIdAndUpdate(
    req.params.id,
    { rtiStatus: status },
    { new: true }
  );
  res.json(updated);
};
