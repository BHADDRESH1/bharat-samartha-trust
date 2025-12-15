const Volunteer = require('../../models/volunteer/vsignup');

// Fetch all pending applications
exports.getPendingVolunteers = async (req, res) => {
  try {
    const pendingVolunteers = await Volunteer.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.status(200).json(pendingVolunteers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending applications' });
  }
};

// Approve a volunteer
exports.approveVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Volunteer.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Volunteer not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Approval failed' });
  }
};

// Reject a volunteer
exports.rejectVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Volunteer.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Volunteer not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Rejection failed' });
  }
};
