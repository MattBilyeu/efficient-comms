const User = require('../models/user');
const Team = require('../models/team');
const Escalation = require('../models/escalation');
const Update = require('../models/update');

const emailer = require('../util/emailer');

const send = emailer.sendEmail;

const bcrypt = require('bcrypt');
const crypto = require('crypto'); 

exports.createUser = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    const teamId = req.body.teamId;
    User.findOne({email: email})
        .then(user => {
            if (user) {
                return res.status(422).json({message: 'A user with that email already exists.'})
            };
            return bcrypt
            .hash(password, 12)
            .then(hashedPassword => {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: hashedPassword,
                    role: role,
                    teamId: teamId,
                    peerReviewer: false
                });
                newUser.save()
                    .then(result => {
                        res.status(201).json({message: 'User created.'})
                    })
                    .catch(err => {
                        console.log(err);
                        next(new Error('Error saving new user.'))
                    })
            })
            .catch(err => {
                console.log(err);
                next(new Error('Error hashing password.'))
            })
        })
        .catch(err => {
            console.log(err);
            next(new Error('Error in server query.'))
        })
};

exports.updateUser = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const peerReview = req.body.peerReview;
    const role = req.body.role;
    if (req.session.role !== 'Admin' || req.session.role !== 'Manager') {
        return res.status(403).json({message: 'Unauthorized to update users.'})
    };
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                return res.status(404).json({message: 'User not found.'})
            };
            user.name = name;
            user.email = email;
            user.peerReview = peerReview;
            user.role = role;
            user.save()
                .then(result => {
                    return res.status(200).json({message: 'User updated.'})
                })
                .catch(err => {
                    console.log(err);
                    next(new Error('Error saving new user.'))
                })
        })
        .catch(err => {
            console.log(err);
            next(new Error('Error in server query.'))
        })
};

exports.sendReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            next(new Error('Error creating reset token.'));
        };
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
            .then(user => {
                user.resetToken = token;
                user.tokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                send(req.body.email, 'no-reply@efficient-comms.com', 'Password Reset',
                    `
                        <h1>Password Reset</h1>
                        <p>You requested a password reset.</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</P.
                    `
                );
                res.status(200).json({message: 'Password Reset Sent - Please check your email.'})
            })
            .catch(err => {
                console.log(err);
                next(new Error('Error in server query.'))
            })
    })
}

exports.resetPassword = (req, res, next) => {
    const token = req.body.token;
    const password = req.body.password;
    let foundUser;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user => {
            foundUser = user;
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    foundUser.password = hashedPassword;
                    return foundUser.save()
                })
                .then(result => {
                    res.status(200).json({message: 'Password updated.'})
                })
                .catch(err => {
                    console.log(err);
                    next(new Error('Error encrypting password.'))
                })
        })
        .catch(err => {
            console.log(err);
            next(new Error('Error in server query.'))
        })
}

exports.findUserById = (req, res, next) => {
    const userId = rea.body.userId;
    User.findById(userId)
        .then(user => {
            if (!user) {
                res.status(404).json({message: 'User not found'})
            };
            return res.status(201).json(user);
        })
        .catch(err => {
            console.log(err);
            next(new Error('Error in server query.')) 
    })
};

exports.deleteUser = (req, res, next) => {
    const userId = req.body.userId;
    let teamId;
    let updateIds;
    User.findByIdAndDelete(userId)
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(422).json({message: 'User not found.'})
            }
            teamId = deletedUser.teamId;
            Escalation.find({ownerId: userId})
                .then(escalations => {
                    escalations.forEach(e => {
                        Escalation.findByIdAndDelete(e._id);
                    })
                })
                .then(result => {
                    Team.findById(teamId)
                        .then(team => {
                            updateIds = team.updates;
                            team.users = team.users.filter(Id => Id !== userId);
                            team.save()
                                .then(result => {
                                    Update.find()
                                        .then(updates => {
                                            updates.forEach(update => {
                                                update.acknowledged = update.acknowledged.filter(id => id !== userId);
                                                update.notAcknowledged = update.notAcknowledged.filter(id => id !== userId);
                                                update.save()
                                            });
                                            return res.status(200).json({message: 'User deleted.'})
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            next(new Error('Server error - unable to save team.'))
                                        })
                                })
                                .catch(err => {
                                    console.log(err);
                                    next(new Error('Server error - unable to save team.'))
                                })
                        })
                        .catch(err => {
                            console.log(err);
                            next(new Error('Server error - unable to query teams.'))
                        })
                })
                .catch(err => {
                    next(new Error('Server error - unable to query escalations.')) 
                })
        })
        .catch(err => {
            console.log(err);
            next(new Error('Server error - unable to query users.'))
        })
}

exports.getUserNames = (req, res, next) => {
    const idArray = req.body.userIds;
    let names = [];
    User.find()
        .then(users => {
            users.forEach(user => {
                if (user._Id in idArray) {
                    names.push(user.name);
                }
            });
            return res.status(201).json(names);
        })
        .catch(err => {
            console.log(err);
            next(new Error('Server error - unable to query users.'))
        })
}