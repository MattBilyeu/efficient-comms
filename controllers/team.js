const Team = require('../models/team');
const Update = require('../models/update');
const Escalation = require('../models/escalation');

const deleteFiles = require('../util/files').deleteFiles;

exports.createTeam = (req, res, next) => {
    const newTeam = new Team({
        name: req.body.name,
        escalations: [],
        updates: [],
        users: []
    });
    newTeam.save()
        .then(result => res.status(201).json({message: 'Team created.'}))
        .catch(err => {
            console.log(err);
            next(new Error('Server error - team not created.'))
        })
};

exports.updateTeamName = (req, res, next) => {
    Team.findById(req.body.teamId)
        .then(team => {
            team.name = req.body.name;
            team.save()
                .then(result => res.status(200).json({message: 'Team name updated.'}))
                .catch(err => {
                    console.log(err);
                    next(new Error('Server error - Unable to save team.'))
                })
        })
        .catch(err => {
            console.log(err);
            next(new Error('Server error - Unable to query team.'))
        })
};

exports.reassignMembers = (req, res, next) => {
    const targetTeam = req.body.teamId;
    const oldTeam = req.body.oldTeamId;
    const userId = req.body.userId;
    let updateIds;
    Team.findById(targetTeam)
        .then(team => {
            team.users.push(userId);
            team.save()
                .then(result => {
                    Team.findById(oldTeam)
                        .then(formerTeam => {
                            updateIds = formerTeam.updates;
                            formerTeam.users = formerTeam.users.filter(Id => Id !== userId);
                            formerTeam.save()
                                .then(result => {
                                    Update.find()
                                        .then(updates => {
                                            updates.forEach(update => {
                                                if (update.teamId === oldTeam) {
                                                    update.notAcknowledged = update.notAcknowledged.filter(id => id !== userId);
                                                    update.acknowledged = update.acknowledged.filter(id => id !== userId);
                                                    update.save()
                                                } else if (update.teamid === targetTeam) {
                                                    update.notAcknowledged.push(userId);
                                                    update.save()
                                                }
                                            });
                                            res.status(200).json({message: 'User reassigned.'})
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            next(new Error('Server error - Unable to query updates.'))
                                        })
                                })
                                .catch(err => {
                                    console.log(err);
                                    next(new Error('Server error - Unable to save team.'))
                                })
                        })
                        .catch(err => {
                            console.log(err);
                            next(new Error('Server error - Unable to query team.'))
                        })
                })
                .catch(err => {
                    console.log(err);
                    next(new Error('Server error - Unable to save team.'))
                })
        })
        .catch(err => {
            console.log(err);
            next(new Error('Server error - Unable to query team.'))
        })
};

exports.deleteTeam = (req, res, next) => {
    Team.findById(req.body.teamId)
        .populate('escalations')
        .populate('updates')
        .then(team => {
            if (team.users.length > 0) {
                return res.status(422).json({message: 'Cannot delete a team with users.'})
            };
            deleteFiles(team.updates.files);
            deleteFiles(team.escalations.files);
            Team.findByIdAndDelete(req.body.teamId)
                .then(result => {
                    Escalation.find()
                        .then(escalations => {
                            escalations.forEach(escalation => {
                                if (escalation.teamId === req.body.teamId) {
                                    escalation.findByIdAndDelete(escalation._Id);
                                };
                            });
                            Update.find()
                                .then(updates => {
                                    updates.forEach(update => {
                                        if (update.teamId === req.body.teamId) {
                                            Update.findByIdAndDelete(update._Id);
                                        }
                                    });
                                    return res.status(200).json({message: 'Team deleted.'})
                                })
                                .catch(err => {
                                    console.log(err);
                                    next(new Error('Server error - Unable to query escalations.'))
                                })
                        })
                        .catch(err => {
                            console.log(err);
                            next(new Error('Server error - Unable to query escalations.'))
                        })
                })
                .catch(err => {
                    console.log(err);
                    next(new Error('Server error - Unable to delete team.'))
                })
        })
        .catch(err => {
            console.log(err);
            next(new Error('Server error - Unable to query team.'))
        })
};

exports.getPopulatedTeam = (req, res, next) => {
    Team.findById(req.body.teamId)
        .populate('users')
        .populate('escalations')
        .populate('users')
        .then(team => {
            team.users = team.users.map(user => user.password = 'redacted');
            res.status(200).json(team);
        })
        .catch(err => {
            console.log(err);
            next(new Error('Server error - Unable to query team.'))
        })
};

exports.getAllTeams = (req, res, next) => {
    if (req.session.role !== 'Admin') {
        return res.status(422).json({message: 'You are not authorized to collect data for every team.'})
    }
    Team.find()
        .populate('users')
        .populate('escalations')
        .populate('updates')
        .then(teams => {
            teams.forEach(team => {
                team.users.map(user => user.password = 'redacted');
            });
            res.status(200).json(teams);
        })
        .catch(err => {
            console.log(err);
            next(new Error('Server error - Unable to query team.'))
        })
}