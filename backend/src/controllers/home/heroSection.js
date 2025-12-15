const heroSection = require('../../models/home/heroSection');

// Get all CTA sections
exports.getAllCTASections = async (req, res) => {
  try {
    const ctas = await heroSection.find();
    res.json(ctas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching CTA sections', error });
  }
};

// Create or update a CTA section
exports.saveOrUpdateCTASection = async (req, res) => {
  const data = req.body;

  if (!data.id) {
    return res.status(400).json({ message: 'CTA section ID is required' });
  }

  try {
    const updatedCTA = await heroSection.findOneAndUpdate(
      { id: data.id },
      data,
      { new: true, upsert: true, runValidators: true }
    );
    res.json(updatedCTA);
  } catch (error) {
    res.status(500).json({ message: 'Error saving CTA section', error });
  }
};

// Delete a CTA section by id
exports.deleteCTASection = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCTA = await heroSection.findOneAndDelete({ id });
    if (!deletedCTA) {
      return res.status(404).json({ message: 'CTA section not found' });
    }
    res.json({ message: 'CTA section deleted', id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting CTA section', error });
  }
};
