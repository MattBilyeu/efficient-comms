const Escalation = require('../models/escalation');
const Team = require('../models/team');

const send = require('../util/emailer').sendEmail;
const deleteFiles = require('../util/files').deleteFiles;

exports.createEscalation = (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    const files = req.files.map((file) => '/files/' + file.filename);
    const teamId = req.session.teamId;
    const ownerId = req.session.userId;
    const ownerName = req.session.name;
    let stage;
    let peerReviewers;
    let foundTeam;
    Team.findById(teamId)
        .populate('users')
        .then(team => {
            foundTeam = team;
            peerReviewers = team.users.filter(user => user.peerReviewer === true);
            if (peerReviewers.length === 0) {
                stage = 'Manager'
            } else {
                stage = 'Peer Review'
            };
            const newEscalation = new Escalation({
                title: title,
                text: text,
                files: files,
                teamId: teamId,
                ownerId: ownerId,
                ownerName: ownerName,
                stage: stage
            });
            newEscalation.save()
                .then(e => {
                    foundTeam.escalations.push(e._Id);
                    foundTeam.save()
                        .then(result => {
                            send(peerReviewers, 'New Escalation for Review', '<p>There is a new escalation ready for review.</p>');
                            res.status(201).json({message: 'Escalation created.'})
                        })
                        .catch(err => {
                            console.log(err);
                            next(new Error('Server error - Unable to save team with escalation.'))
                        })
                })
                .catch(err => {
                    console.log(err);
                    next(new Error('Server error - Unable to save escalation.'))
                })
        })
        .catch(err => {
            console.log(err);
            next(new Error('Server error - Unable to query team.'))
        })
};

exports.advanceEscalation = (req, res, next) => {
    const escalationId = req.body.escalationId;
    const teamId = req.body.teamId;
    let team;
    let peerReviewers;
    Team.findById(teamId)
        .populate('users')
        .then(foundTeam => {
            team = foundTeam;
            peerReviewers = foundTeam.users.filter(user => user.peerReviewer === true);
            Escalation.findById(escalationId)
                .populate(teamId)
                .then(escalation => {
                    let emailList;
                    if (escalation.stage === 'Peer Review') {
                        escalation.stage = 'Manager';
                        emailList = team.users.filter(user => user.role === 'Manager').map(user => user.email);
                    } else if (escalation.stage === 'Manager') {
                        escalation.stage = 'Member';
                        emailList = [team.users.filter(user => userId === req.session.userId).map(user => user.email)];
                    } else if (escalation.stage === 'Member' && peerReviewers.length === 0) {
                        escalation.stage = 'Manager'
                        emailList = team.users.filter(user => user.role === 'Manager').map(user => user.email);
                    } else {
                        escalation.stage = 'Peer Review'
                        peerReviewers = team.users.filter(user => user.peerReviewer === true).map(user => user.email);
                    };
                    escalation.save()
                        .then(result => {
                            send(emailList, 'Escalation Ready for Review', '<p>An escalation is ready for your review.</p>');
                        })
                        .catch(err => {
                            console.log(err);
                            next(new Error('Server error - Unable to query team.'))
                        })
                })
        })
};

exports.updateEscalation = (req, res, next) => {
    
};

exports.deleteEscalation = (req, res, next) => {
    // Make sure to delete the files
};