const express = require('express');
const router = express.Router();
const { getCta, saveCta } = require('../../controllers/cause/causeCta');

router.get('/', getCta);
router.post('/', saveCta);

module.exports = router;
