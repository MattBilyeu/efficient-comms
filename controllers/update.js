const Update = require('../models/update');
const Team = require('../models/team');

const emailer = require('../util/emailer');

const send = emailer.sendEmail;

exports.createUpdate = (req, res, next) => {
    const userId = req.body.userId;
    const filesObs = req.files;
    const teamId = req.body.teamId;
    const title = req.body.title;
    const text = req.body.text;
    const acknowledged = [userId];
    const notAcknowledged = [];
    const files = filesObs.map((file) => '/files/' + file.filename);
    let team;
    Team.findById(teamId)
        .then(team => {
            team = team;
            notAcknowledged = team.users.filter(_Id => _Id !== userId);
            const newUpdate = new Update({
                teamId: teamId,
                title: title,
                text: text,
                acknowledged: acknowledged,
                notAcknowledged, notAcknowledged,
                files: files
            });
            newUpdate.save()
                .then(result => {
                    team.updates.push(result._Id);
                    team.save()
                        .then(result => {
                            res.status(201).json({message: 'Update created.'})
                        })
                        .catch(err => {
                            console.log(err);
                            next(new Error('Server operation error - Unable to save team with update ID.'))
                        })
                })
                .catch(err => {
                    console.log(err);
                    next(new Error('Server operation error - Unable to save update.'))
                })
        })
        .catch(err => {
            console.log(err);
            next(new Error('Server query error - Unable to search for team.'))
        })
    
};

exports.updateUpdate = (req, res, next) => {
    
};

exports.acknowledgeUpdate = (req, res, next) => {

};

exports.deleteUpdate = (req, res, next) => {
    
}