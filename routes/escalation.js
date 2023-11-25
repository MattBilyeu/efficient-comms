const express = require('express');

const router = express.Router();

const escalationController = require('../controllers/escalation');

router.post('/create', escalationController.createEscalation);

router.post('/advance', escalationController.advanceEscalation);

router.post('/delete', escalationController.deleteEscalation);

module.exports = router;