// controllers/volunteerController.js
const Volunteer = require('../../models/volunteer/vsignup');

exports.createVolunteer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      interests,
      availability,
      commitmentType,
      skills,
      experience,
      languages,
      aadhaarCardPath,
      photoPath,
      volunteerId,
      certificateDate,
      badgeLevel,
    } = req.body;

    const newVolunteer = await Volunteer.create({
      firstName,
      lastName,
      email,
      phone,
      address,
      interests,
      availability,
      commitmentType,
      skills,
      experience,
      languages,
      aadhaarCardPath,
      photoPath,
      volunteerId,
      certificateDate,
      badgeLevel,
    });

    res.status(201).json({ message: 'Volunteer created successfully', data: newVolunteer });
  } catch (error) {
    console.error('Error creating volunteer:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching volunteers', error });
  }
};

exports.updateVolunteerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be pending, approved, or rejected.' 
      });
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json({ 
      message: 'Volunteer status updated successfully', 
      volunteer 
    });
  } catch (error) {
    console.error('Error updating volunteer status:', error);
    res.status(500).json({ 
      message: 'Error updating volunteer status', 
      error: error.message 
    });
  }
};