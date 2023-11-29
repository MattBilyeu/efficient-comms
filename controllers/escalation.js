const Escalation = require('../models/escalation');
const Team = require('../models/team');

const send = require('../util/emailer').sendEmail;
const deleteFiles = require('../util/files').deleteFiles;

exports.createEscalation = (req, res, next) => {
    const title = req.body.title;
    const notes = req.body.notes;
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
                notes: notes,
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
    const teamId = req.session.teamId;
    const note = req.body.note;
    const files = req.files.map(file => '/files/' + file.filename);
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
                        emailList = team.users.filter(user => user._Id === escalation.ownerId).map(user => user.email);
                    } else if (escalation.stage === 'Member' && peerReviewers.length === 0) {
                        escalation.stage = 'Manager'
                        emailList = team.users.filter(user => user.role === 'Manager').map(user => user.email);
                    } else {
                        escalation.stage = 'Peer Review'
                        emailList = peerReviewers.map(user => user.email);
                    };
                    if (files.length !== 0) {
                        deleteFiles(escalation.files);
                        escalation.files = files;
                    };
                    escalation.notes.push(note);
                    escalation.save()
                        .then(result => {
                            send(emailList, 'Escalation Ready for Review', '<p>An escalation is ready for your review.</p>');
                            res.status(201).json({message: 'Escalation advanced.'})
                        })
                        .catch(err => {
                            console.log(err);
                            next(new Error('Server error - Unable to query team.'))
                        })
                })
        })
};

exports.deleteEscalation = (req, res, next) => {
    Escalation.findByIdAndDelete(req.body.escalationId)
        .then(result => {
            Team.findById(req.session.teamId)
                .then(team => {
                    team.escalations = team.escalations.filter(e => e._Id !== req.session.escalationId);
                    team.save()
                        .then(result => res.status(200).json({message: 'Escalation removed.'}))
                        .catch(err => {
                            console.log(err);
                            next(new Error('Server error - Unable to save team data.'))
                        })
                })
                .catch(err => {
                    console.log(err);
                    next(new Error('Server error - Unable to query team.'))
                })
        })
        .catch(err => {
            console.log(err);
            next(new Error('Server error - Unable to query escalation.'))
        })
};