const Team = require('../../models/about/aboutTeam');
const { executeWithFallback } = require('../../utils/dbHelpers');

// Initialize if not exists
const getOrCreateTeam = async () => {
  return await executeWithFallback(
    async () => {
      let team = await Team.findOne();
      if (!team) {
        team = await Team.create({ sectionSettings: {}, members: [] });
      }
      return team;
    },
    {
      sectionSettings: {
        title: "Our Leadership Team",
        subtitle: "Meet the people leading our mission",
        description: "Our dedicated team brings diverse expertise and passion to drive positive change in communities worldwide."
      },
      members: [
        {
          id: "1",
          name: "John Smith",
          role: "Chief Executive Officer",
          bio: "Leading our organization with over 15 years of nonprofit experience.",
          imageUrl: "/images/team/default-ceo.jpg",
          socialLinks: []
        },
        {
          id: "2",
          name: "Sarah Johnson",
          role: "Director of Operations",
          bio: "Ensuring our programs run efficiently and effectively.",
          imageUrl: "/images/team/default-director.jpg",
          socialLinks: []
        }
      ]
    },
    'Get or Create Team'
  );
};

// Get both settings and members
exports.getTeamData = async (req, res) => {
  try {
    const team = await getOrCreateTeam();
    res.json(team);
  } catch (error) {
    console.error('Error fetching team data:', error);
    // Return default data even if there's an error
    res.json({
      sectionSettings: {
        title: "Our Leadership Team",
        subtitle: "Meet the people leading our mission",
        description: "Our dedicated team brings diverse expertise and passion to drive positive change in communities worldwide."
      },
      members: [
        {
          id: "1",
          name: "John Smith",
          role: "Chief Executive Officer",
          bio: "Leading our organization with over 15 years of nonprofit experience.",
          imageUrl: "/images/team/default-ceo.jpg",
          socialLinks: []
        },
        {
          id: "2",
          name: "Sarah Johnson",
          role: "Director of Operations",
          bio: "Ensuring our programs run efficiently and effectively.",
          imageUrl: "/images/team/default-director.jpg",
          socialLinks: []
        }
      ]
    });
  }
};

// Save (add/update) a member
exports.saveMember = async (req, res) => {
  try {
    const { id, ...data } = req.body;
    
    const result = await executeWithFallback(
      async () => {
        const team = await getOrCreateTeam();
        
        let updatedMembers;
        if (id) {
          updatedMembers = team.members.map(m =>
            m.id === id ? { ...m.toObject(), ...data, id } : m
          );
        } else {
          const newMember = {
            id: Date.now().toString(),
            ...data
          };
          updatedMembers = [...team.members, newMember];
        }
        
        team.members = updatedMembers;
        await team.save();
        return { members: team.members };
      },
      { members: [] },
      'Save Member'
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error saving member:', error);
    res.status(500).json({ success: false, message: 'Failed to save member' });
  }
};

// Delete a member
exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await executeWithFallback(
      async () => {
        const team = await getOrCreateTeam();
        team.members = team.members.filter(m => m.id !== id);
        await team.save();
        return { success: true };
      },
      { success: true },
      'Delete Member'
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ success: false, message: 'Failed to delete member' });
  }
};

// Save section settings
exports.saveSettings = async (req, res) => {
  try {
    const settingsData = req.body;
    
    const result = await executeWithFallback(
      async () => {
        const team = await getOrCreateTeam();
        team.sectionSettings = settingsData;
        await team.save();
        return team.sectionSettings;
      },
      settingsData,
      'Save Settings'
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ success: false, message: 'Failed to save settings' });
  }
};