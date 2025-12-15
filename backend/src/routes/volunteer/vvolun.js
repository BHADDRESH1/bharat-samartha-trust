const express = require('express');
const router = express.Router();
const {
  getPendingVolunteers,
  approveVolunteer,
  rejectVolunteer
} = require('../../controllers/volunteer/vvolun');

// GET all pending applications
router.get('/pending', getPendingVolunteers);

// PATCH approve
router.patch('/:id/approve', approveVolunteer);

// PATCH reject
router.patch('/:id/reject', rejectVolunteer);

module.exports = router;
