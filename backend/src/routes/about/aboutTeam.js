const express = require('express');
const router = express.Router();
const {
  getTeamData,
  saveMember,
  deleteMember,
  saveSettings
} = require('../../controllers/about/aboutteam.js');
const uploadController = require('../../controllers/upload.js')

router.get('/', getTeamData);
router.post('/member', saveMember);
router.delete('/member/:id', deleteMember);
router.post('/settings', saveSettings);
router.post('/upload-image', uploadController.uploadImage);

module.exports = router;
