const express = require('express');

const router = express.Router();

const updateController = require('../controllers/update');

router.post('/create', updateController.createUpdate);

router.post('/update', updateController.updateUpdate);

router.post('/acknowledge', updateController.acknowledgeUpdate);

router.post('/delete', updateController.deleteUpdate);

module.exports = router;