const FAQ = require('../../models/volunteer/vFaq');

// GET all FAQs
exports.getAllFAQs = async (req, res) => {
  const faqs = await FAQ.find();
  res.json(faqs);
};

// POST new FAQ
exports.createFAQ = async (req, res) => {
  const { question, answer, gif, category, isActive } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const faq = new FAQ({
    question,
    answer,
    gif,
    category,
    isActive,
    createdDate: today,
    lastModified: today,
    views: 0
  });
  await faq.save();
  res.status(201).json(faq);
};

// UPDATE FAQ
exports.updateFAQ = async (req, res) => {
  const { id } = req.params;
  const updatedData = {
    ...req.body,
    lastModified: new Date().toISOString().split('T')[0]
  };
  const updated = await FAQ.findByIdAndUpdate(id, updatedData, { new: true });
  if (!updated) {
    return res.status(404).json({ message: 'FAQ not found' });
  }
  res.json(updated);
};

// DELETE FAQ
exports.deleteFAQ = async (req, res) => {
  const { id } = req.params;
  const deleted = await FAQ.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ message: 'FAQ not found' });
  }
  res.json({ message: 'FAQ deleted successfully' });
};

// TOGGLE FAQ STATUS
exports.toggleFAQStatus = async (req, res) => {
  const { id } = req.params;
  const faq = await FAQ.findById(id);
  if (!faq) {
    return res.status(404).json({ message: 'FAQ not found' });
  }
  faq.isActive = !faq.isActive;
  faq.lastModified = new Date().toISOString().split('T')[0];
  await faq.save();
  res.json(faq);
};
