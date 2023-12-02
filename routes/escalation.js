const express = require('express');

const router = express.Router();

const escalationController = require('../controllers/escalation');

router.post('/createEscalation', escalationController.createEscalation);

router.post('/advanceEscalation', escalationController.advanceEscalation);

router.post('/deleteEscalation', escalationController.deleteEscalation);

module.exports = router;