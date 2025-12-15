const Impact = require('../../models/cause/causesImpact');

// GET current impact data
exports.getImpact = async (req, res) => {
  try {
    let impact = await Impact.findOne();
    if (!impact) {
      // If no data exists, return default structure
      impact = {
        headerData: { title: '', subtitle: '' },
        stats: [],
        storyContent: { title: '', paragraphs: [] },
        goalsContent: { title: '', goals: [] },
        footerQuote: ''
      };
    }
    res.json(impact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching impact data', error });
  }
};


// SAVE or UPDATE impact data
exports.saveImpact = async (req, res) => {
  try {
    const data = req.body;
    let impact = await Impact.findOne();
    if (impact) {
      await Impact.updateOne({}, data);
    } else {
      impact = new Impact(data);
      await impact.save();
    }
    res.json({ message: 'Impact data saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving impact data', error });
  }
};
