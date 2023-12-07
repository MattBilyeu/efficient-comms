const Update = require('../models/update');
const Team = require('../models/team');
const deleteFiles = require('../util/files').deleteFiles;

const { send } = require('../util/emailer');

const sendMailList = function(array, subject, body) {
    array.forEach(email => {
        send([email], subject, body)
    })
};

exports.createUpdate = (req, res, next) => {
    let files = [];
    if (req.files) {
        files = req.files.map((file) => '/files/' + file.filename);
    };
    const teamId = req.session.teamId;
    const title = req.body.title;
    const text = req.body.text;
    const acknowledged = [req.session.userId];
    let notAcknowledged = [];
    const role = req.session.role;
    if (role !== 'Manager' && role !== 'Admin') {
        return res.status(403).json({message: 'You are not authorized to create updates.'})
    };
    Team.findById(teamId)
        .populate('users')
        .then(team => {
            const emailList = team.users.map((user) => user.email);
            sendMailList(emailList, `New Update - ${title}`, '<p>You have a new update ready for review.</p>');
            notAcknowledged = 
                team.users
                    .map(user => user._id.toString())
                    .filter(_id => _id !== req.session.userId.toString());
            const newUpdate = new Update({
                teamId: teamId,
                title: title,
                text: text,
                acknowledged: acknowledged,
                notAcknowledged: notAcknowledged,
                files: files
            });
            newUpdate.save()
                .then(result => {
                    team.updates.push(result._id);
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
    const userId = req.session.userId;
    const updateId = req.body.updateId;
    const text = req.body.text;
    const teamId = req.session.teamId;
    console.log(req);
    let files = [];
    if (req.files) {
        files = req.files.map((file) => '/files/' + file.filename);
    }
    let changedUpdate;
    let emailList
    Update.findById(updateId)
        .then(update=> {
            if (text) {
                update.text = text;
            };
            if (files.length !== 0) {
                deleteFiles(update.files);
                update.files = files;
            };
            update.acknowledged = [userId];
            changedUpdate = update;
            Team.findById(teamId).populate('users').then(team => {
                emailList = team.users.map((user) => user.email);
                changedUpdate.notAcknowledged = team.users.map((userObj) => userObj._id).filter((_id => _id !== userId));
                changedUpdate.save()
                    .then(result => {
                        sendMailList(emailList, `Update Changed - ${result.title}`, '<p>An update has been deleted, please review again.</p>');
                        res.status(201).json({message: 'Update changed successfully.'})
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
        })
        .catch(err => {
            console.log(err);
            next(new Error('Server query error - Unable to search for update.'))
        })
};

exports.acknowledgeUpdate = (req, res, next) => {
    const userId = req.session.userId;
    const updateId = req.body.updateId;
    update.findById(updateId)
        .then(update => {
            update.acknowledged.push(userId);
            update.notAcknowledged = update.notAcknowledged.filter(Id => Id.toString() !== userId.toString());
            if (update.notAcknowledged.length === 0) {
                deleteFiles(update.files);
            };
            update.save()
                .then(result => {
                    res.status(201).json({message: 'Update acknowledged.'})
                })
                .catch(err => {
                    console.log(err);
                    next(new Error('Server operation error - Unable to save update.'))
                })
        })
        .catch(err => {
            console.log(err);
            next(new Error('Server query error - Unable to search for update.'))
        })

};

exports.deleteUpdate = (req, res, next) => {
    const updateId = req.body.updateId;
    const role = req.session.role;
    if (role !== 'Manager' && role !== 'Admin') {
        return res.status(403).json({message: 'You are not authorized to delete updates.'})
    };
    Update.findById(updateId)
        .then(update => {
            deleteFiles(update.files);
            Update.findByIdAndDelete(updateId)
                .then(result => {
                    Team.findById(result.teamId)
                    .then(team => {
                        team.updates = team.updates.filter(Id => Id.toString() !== updateId.toString());
                        team.save()
                            .then(result => {
                                res.status(200).json({message: 'Update deleted.'})
                            })
                            .catch(err => {
                                console.log(err);
                                next(new Error('Server operation error - Unable to save team.'))
                            })
                    })
                    .catch(err => {
                        console.log(err);
                        next(new Error('Server operation error - Unable to search for team.'))
                    })
                })
                .catch(err => {
                    console.log(err);
                    next(new Error('Server operation error - Unable to delete update.'))
                })
        })
}