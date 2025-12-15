const VolunteerRole = require('../../models/volunteer/vrole');

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await VolunteerRole.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create new role
exports.createRole = async (req, res) => {
  try {
    const roleData = req.body;
    const today = new Date().toISOString().split('T')[0];
    const newRole = new VolunteerRole({
      ...roleData,
      applicantsCount: 0,
      createdDate: today,
      lastUpdated: today
    });
    const savedRole = await newRole.save();
    res.status(201).json(savedRole);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

// Update role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await VolunteerRole.findByIdAndUpdate(
      id,
      { ...req.body, lastUpdated: new Date().toISOString().split('T')[0] },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
};

// Delete role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    await VolunteerRole.findByIdAndDelete(id);
    res.json({ message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

// Toggle status
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await VolunteerRole.findById(id);
    role.isActive = !role.isActive;
    role.lastUpdated = new Date().toISOString().split('T')[0];
    await role.save();
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: 'Status update failed' });
  }
};
