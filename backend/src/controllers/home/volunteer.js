const VolunteerManagement = require('../../models/home/volunteer');
const mongoose = require('mongoose');

// GET all volunteer data
const getVolunteerData = async (req, res) => {
  try {
    const data = await VolunteerManagement.findOne();
    if (!data) {
      // Return default structure if no data exists
      return res.json({
        sectionSettings: {
          sectionVisible: true,
          sectionTitle: 'Volunteer Opportunities',
          sectionSubtitle: 'Join our mission to make a difference',
          highlightUrgent: true,
          showSkillsRequired: true,
          showBenefits: true
        },
        opportunities: []
      });
    }
    
    // Convert MongoDB _id to frontend id format
    const responseData = {
      sectionSettings: data.sectionSettings,
      opportunities: data.opportunities.map(opp => {
        const oppObj = opp.toObject();
        return {
          ...oppObj,
          id: oppObj._id.toString(), // Convert ObjectId to string for frontend
          _id: undefined // Remove _id from response
        };
      })
    };
    
    res.json(responseData);
  } catch (err) {
    console.error('Get volunteer data error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST (create or update) volunteer data
const saveVolunteerData = async (req, res) => {
  const { sectionSettings, opportunities } = req.body;

  try {
    console.log('Received opportunities:', opportunities);

    // Get existing data to maintain ID mappings
    let existingData = await VolunteerManagement.findOne();
    const existingOpportunities = existingData ? existingData.opportunities : [];
    
    // Create a map of existing opportunities by their frontend ID
    const existingMap = new Map();
    existingOpportunities.forEach(opp => {
      existingMap.set(opp._id.toString(), opp._id);
    });

    // Transform opportunities: handle ID mapping properly
    const transformedOpportunities = opportunities.map(opp => {
      const transformed = { ...opp };
      
      // Remove the frontend id field
      const frontendId = transformed.id;
      delete transformed.id;
      
      // Check if this opportunity already exists (by matching frontend ID to existing MongoDB ID)
      if (frontendId && existingMap.has(frontendId)) {
        // Use existing MongoDB ObjectId
        transformed._id = existingMap.get(frontendId);
      } else {
        // Generate new ObjectId for new opportunities
        transformed._id = new mongoose.Types.ObjectId();
      }
      
      console.log(`Transformed opportunity: frontend ID ${frontendId} -> MongoDB ID ${transformed._id}`);
      
      return transformed;
    });

    console.log('Transformed opportunities:', transformedOpportunities);

    // Save or update data
    if (existingData) {
      existingData.sectionSettings = sectionSettings;
      existingData.opportunities = transformedOpportunities;
      await existingData.save();
    } else {
      existingData = await VolunteerManagement.create({ 
        sectionSettings, 
        opportunities: transformedOpportunities 
      });
    }

    // Transform response back to frontend format
    const responseData = {
      sectionSettings: existingData.sectionSettings,
      opportunities: existingData.opportunities.map(opp => {
        const oppObj = opp.toObject();
        return {
          ...oppObj,
          id: oppObj._id.toString(),
          _id: undefined
        };
      })
    };

    res.json({ 
      message: 'Volunteer data saved successfully', 
      data: responseData 
    });
  } catch (err) {
    console.error('Save volunteer data error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getVolunteerData, saveVolunteerData };