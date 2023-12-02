const express = require('express');

const router = express.Router();

const updateController = require('../controllers/update');

router.post('/createUpdate', updateController.createUpdate);

router.post('/updateUpdate', updateController.updateUpdate);

router.post('/acknowledgeUpdate', updateController.acknowledgeUpdate);

router.post('/deleteUpdate', updateController.deleteUpdate);

module.exports = router;