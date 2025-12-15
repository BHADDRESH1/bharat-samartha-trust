const Dashboard = require('../../models/volunteer/vimpact');

// Ensure a single dashboard document exists
const getOrCreateDashboard = async () => {
  let dashboard = await Dashboard.findOne();
  if (!dashboard) {
    dashboard = new Dashboard(); // defaults will fill
    await dashboard.save();
  }
  return dashboard;
};

// GET /api/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const dashboard = await getOrCreateDashboard();
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data.' });
  }
};

// PUT /api/dashboard/stats
exports.updateStats = async (req, res) => {
  try {
    const dashboard = await getOrCreateDashboard();
    dashboard.stats = req.body;
    await dashboard.save();
    res.json(dashboard.stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stats.' });
  }
};

// POST /api/dashboard/volunteers
exports.addVolunteer = async (req, res) => {
  try {
    const { name, hours, badge, email } = req.body;
    if (!name || !hours || !badge || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const dashboard = await getOrCreateDashboard();
    dashboard.topVolunteers.push({
      ...req.body,
      joinDate: new Date()
    });
    await dashboard.save();

    res.json(dashboard.topVolunteers[dashboard.topVolunteers.length - 1]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add volunteer.' });
  }
};

// PUT /api/dashboard/volunteers/:id
exports.updateVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const dashboard = await getOrCreateDashboard();
    const volunteer = dashboard.topVolunteers.id(id);

    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }

    Object.assign(volunteer, req.body);
    await dashboard.save();
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update volunteer.' });
  }
};

// DELETE /api/dashboard/volunteers/:id
exports.deleteVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const dashboard = await getOrCreateDashboard();

    const index = dashboard.topVolunteers.findIndex(v => v._id.toString() === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }

    dashboard.topVolunteers.splice(index, 1);
    await dashboard.save();

    res.json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete volunteer.' });
  }
};
