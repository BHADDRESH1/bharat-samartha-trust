const express = require('express');
const router = express.Router();
const examController = require('../../controllers/exam/eoverview');

router.post('/', examController.createExam);
router.get('/', examController.getAllExams);
router.put('/:id', examController.updateExam);
router.delete('/:id', examController.deleteExam);

module.exports = router;
