// routes/volunteerRoutes.js
const express = require('express');
const router = express.Router();
const {
  createVolunteer,
  getVolunteers,
  updateVolunteerStatus
} = require('../../controllers/volunteer/vsignup.js');


const uploadController = require('../../controllers/upload.js')

router.post('/upload-image', uploadController.uploadImage);
// POST - Save final form data (after images uploaded separately)
router.post('/', createVolunteer);
router.patch('/:id', updateVolunteerStatus);
// GET - Fetch all volunteer submissions
router.get('/', getVolunteers);

module.exports = router;
