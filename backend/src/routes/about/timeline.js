const express = require('express');
const router = express.Router();
const timelineController = require('../../controllers/about/timeline');

router.get('/', timelineController.getAllTimelineItems);
router.post('/', timelineController.createTimelineItem);
router.put('/:id', timelineController.updateTimelineItem);
router.delete('/:id', timelineController.deleteTimelineItem);

module.exports = router;
