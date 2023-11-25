const express = require('express');

const router = express.Router();

const teamController = require('../controllers/team');

router.post('/create', teamController.createTeam);

router.post('/updateName', teamController.updateTeamName);

router.post('/reassign', teamController.reassignMembers);

router.post('/delete', teamController.deleteTeam);

router.post('/getPopulatedTeam', teamController.getPopulatedTeam);

router.post('/getAllTeams', teamController.getAllTeams);

module.exports = router;