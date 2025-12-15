const express = require('express');
const router = express.Router();
const {
  getAll,
  addPartner,
  updatePartner,
  deletePartner
} = require('../../controllers/volunteer/vTrust');

router.get('/', getAll);
router.post('/partner', addPartner);
router.put('/partner/:id', updatePartner);
router.delete('/partner/:id', deletePartner);

module.exports = router;
