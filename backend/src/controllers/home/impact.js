const Impact = require('../../models/home/impactModel');

// GET impact data
exports.getImpact = async (req, res) => {
  try {
    let data = await Impact.findOne();
    if (!data) {
      data = await Impact.create({ title: '', subtitle: '', description: '', backgroundImage: '', stats: [], achievements: [] });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update impact data

exports.updateImpact = async (req, res) => {
  try {
    let impact = await Impact.findOne();
    if (!impact) {
      impact = new Impact(req.body);
    } else {
      Object.assign(impact, req.body);
    }
    const saved = await impact.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

