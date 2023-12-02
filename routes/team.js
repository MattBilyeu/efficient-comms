const express = require('express');

const router = express.Router();

const teamController = require('../controllers/team');

router.post('/createTeam', teamController.createTeam);

router.post('/updateTeamName', teamController.updateTeamName);

router.post('/reassignMembers', teamController.reassignMembers);

router.post('/deleteTeam', teamController.deleteTeam);

router.post('/getPopulatedTeam', teamController.getPopulatedTeam);

router.post('/getAllTeams', teamController.getAllTeams);

module.exports = router;