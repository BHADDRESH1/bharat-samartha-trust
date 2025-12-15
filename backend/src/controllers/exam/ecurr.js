const EcurrItem = require('../../models/exam/ecurr');

exports.getItemsByType = async (req, res) => {
  const { type } = req.query;
  try {
    if (!['news', 'quiz', 'exam'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const items = await EcurrItem.find({ type });
    res.json(items);
  } catch (err) {
    console.error('GET Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const item = await EcurrItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error('POST Error:', err);
    res.status(500).json({ error: 'Creation failed' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const updated = await EcurrItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('PUT Error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await EcurrItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('DELETE Error:', err);
    res.status(500).json({ error: 'Deletion failed' });
  }
};
