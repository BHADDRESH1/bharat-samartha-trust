const { Law, Settings } = require('../../models/legal/finder');

exports.getAllLaws = async (req, res) => {
  try {
    console.log('Fetching all laws...'); // Debug log
    const laws = await Law.find();
    console.log(`Found ${laws.length} laws`); // Debug log
    res.json(laws);
  } catch (err) {
    console.error('Error fetching laws:', err); // Debug log
    res.status(500).json({ error: err.message });
  }
};

exports.getLawById = async (req, res) => {
  try {
    console.log(`Fetching law with ID: ${req.params.id}`); // Debug log
    const law = await Law.findById(req.params.id);
    if (!law) {
      console.log('Law not found'); // Debug log
      return res.status(404).json({ error: 'Law not found' });
    }
    res.json(law);
  } catch (err) {
    console.error('Error fetching law by ID:', err); // Debug log
    res.status(500).json({ error: err.message });
  }
};

exports.createLaw = async (req, res) => {
  try {
    console.log('Creating new law:', req.body.title); // Debug log
    const newLaw = new Law(req.body);
    const saved = await newLaw.save();
    console.log('Law created successfully:', saved._id); // Debug log
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating law:', err); // Debug log
    res.status(400).json({ error: err.message });
  }
};

exports.updateLaw = async (req, res) => {
  try {
    console.log(`Updating law with ID: ${req.params.id}`); // Debug log
    const updated = await Law.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // Added runValidators
    );
    if (!updated) {
      return res.status(404).json({ error: 'Law not found' });
    }
    console.log('Law updated successfully'); // Debug log
    res.json(updated);
  } catch (err) {
    console.error('Error updating law:', err); // Debug log
    res.status(400).json({ error: err.message });
  }
};

exports.deleteLaw = async (req, res) => {
  try {
    console.log(`Deleting law with ID: ${req.params.id}`); // Debug log
    const deleted = await Law.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Law not found' });
    }
    console.log('Law deleted successfully'); // Debug log
    res.json({ message: 'Law deleted successfully' });
  } catch (err) {
    console.error('Error deleting law:', err); // Debug log
    res.status(500).json({ error: err.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    console.log('Fetching settings...'); // Debug log
    let settings = await Settings.findOne();

    if (!settings) {
      console.log('No settings found, creating default settings...'); // Debug log
      // Set default values if not found
      settings = new Settings({
        fuzzySearch: true,
        keywordHighlighting: true,
        searchSuggestions: true,
        adminApproval: false,
        auditLog: true
      });
      await settings.save();
      console.log('Default settings created'); // Debug log
    }

    console.log('Settings fetched successfully'); // Debug log
    res.json(settings);
  } catch (err) {
    console.error('Error fetching settings:', err); // Debug log
    res.status(500).json({ error: err.message });
  }
};

exports.saveSettings = async (req, res) => {
  try {
    console.log('Saving settings...', req.body); // Debug log
    let settings = await Settings.findOne();
    
    if (settings) {
      // Update existing settings
      settings = await Settings.findByIdAndUpdate(
        settings._id, 
        req.body, 
        { new: true, runValidators: true }
      );
      console.log('Settings updated successfully'); // Debug log
    } else {
      // Create new settings
      settings = await Settings.create(req.body);
      console.log('New settings created successfully'); // Debug log
    }
    
    res.json(settings);
  } catch (err) {
    console.error('Error saving settings:', err); // Debug log
    res.status(400).json({ error: err.message });
  }
};