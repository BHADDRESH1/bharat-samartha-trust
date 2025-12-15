const { Right, Scheme, Resource } = require('../../models/legal/legalsec');

// Generic CRUD functions
const createItem = async (Model, req, res) => {
  try {
    const item = new Model(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllItems = async (Model, res) => {
  try {
    const items = await Model.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateItem = async (Model, req, res) => {
  try {
    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteItem = async (Model, req, res) => {
  try {
    await Model.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllData = async (req, res) => {
  try {
    const [rights, schemes, resources] = await Promise.all([
      Right.find(),
      Scheme.find(),
      Resource.find()
    ]);
    res.json({ rights, schemes, resources });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Export all controller functions
module.exports = {
  getRights: (req, res) => getAllItems(Right, res),
  addRight: (req, res) => createItem(Right, req, res),
  updateRight: (req, res) => updateItem(Right, req, res),
  deleteRight: (req, res) => deleteItem(Right, req, res),

  getSchemes: (req, res) => getAllItems(Scheme, res),
  addScheme: (req, res) => createItem(Scheme, req, res),
  updateScheme: (req, res) => updateItem(Scheme, req, res),
  deleteScheme: (req, res) => deleteItem(Scheme, req, res),

  getResources: (req, res) => getAllItems(Resource, res),
  addResource: (req, res) => createItem(Resource, req, res),
  updateResource: (req, res) => updateItem(Resource, req, res),
  deleteResource: (req, res) => deleteItem(Resource, req, res)
  
};
