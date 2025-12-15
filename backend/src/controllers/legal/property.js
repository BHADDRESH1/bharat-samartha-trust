const {
  LegalTerm,
  InheritanceRule,
  LegalDocument,
  FarmerRight
} = require('../../models/legal/property');

// --- LEGAL TERMS ---

exports.getAllTerms = async (req, res) => {
  const data = await LegalTerm.find();
  res.json(data);
};

exports.createTerm = async (req, res) => {
  const term = new LegalTerm(req.body);
  await term.save();
  res.status(201).json(term);
};

exports.updateTerm = async (req, res) => {
  const updated = await LegalTerm.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteTerm = async (req, res) => {
  await LegalTerm.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

// --- INHERITANCE RULES ---

exports.getAllInheritance = async (req, res) => {
  const data = await InheritanceRule.find();
  res.json(data);
};

exports.createInheritance = async (req, res) => {
  const rule = new InheritanceRule(req.body);
  await rule.save();
  res.status(201).json(rule);
};

exports.updateInheritance = async (req, res) => {
  const updated = await InheritanceRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteInheritance = async (req, res) => {
  await InheritanceRule.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

// --- DOCUMENTS ---

exports.getAllDocuments = async (req, res) => {
  const data = await LegalDocument.find();
  res.json(data);
};

exports.createDocument = async (req, res) => {
  const doc = new LegalDocument(req.body);
  await doc.save();
  res.status(201).json(doc);
};

exports.updateDocument = async (req, res) => {
  const updated = await LegalDocument.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteDocument = async (req, res) => {
  await LegalDocument.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

// --- FARMER RIGHTS ---

exports.getAllFarmers = async (req, res) => {
  const data = await FarmerRight.find();
  res.json(data);
};

exports.createFarmer = async (req, res) => {
  const right = new FarmerRight(req.body);
  await right.save();
  res.status(201).json(right);
};

exports.updateFarmer = async (req, res) => {
  const updated = await FarmerRight.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteFarmer = async (req, res) => {
  await FarmerRight.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};


exports.getAllData = async (req, res) => {
  try {
    const [terms, inheritance, documents, farmers] = await Promise.all([
      LegalTerm.find().lean(),
      InheritanceRule.find().lean(),
      LegalDocument.find().lean(),
      FarmerRight.find().lean()
    ]);

    const mapId = (arr) => arr.map(item => ({ ...item, id: item._id }));

    res.json({
      terms: mapId(terms),
      inheritance: mapId(inheritance),
      documents: mapId(documents),
      farmers: mapId(farmers)
    });
  } catch (err) {
    console.error('Error fetching all data:', err);
    res.status(500).json({ error: 'Failed to fetch all data' });
  }
};
