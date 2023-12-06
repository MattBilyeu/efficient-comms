const User = require('../models/user');
const Team = require('../models/team');
const Escalation = require('../models/escalation');
const Update = require('../models/update');

const { send } = require('../util/emailer');

const bcrypt = require('bcrypt');
const crypto = require('crypto'); 

sendNewUserEmail = function(email) {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            next(new Error('Error creating reset token.'));
        };
        const token = buffer.toString('hex');
        User.findOne({email: email})
            .then(user => {
                user.resetToken = token;
                user.tokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                const html =                     
                    `
                        <h1>New User</h1>
                        <p>The first step is to update your password.</p>
                        <p>Click this <a href="http://localhost:3000/pass-reset/${token}">link</a> to set a new password.</p>
                    `;
                send([email], 'Welcome to Efficient Comms!',html);
            })
            .catch(err => {
                console.log(err);
                next(new Error('Error in server query.'))
            })
    })
};

exports.createUser = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = 'TempPassword';
    const role = req.body.role;
    const teamId = req.body.teamId;
    let savedUser;
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
                        savedUser = result;
                        sendNewUserEmail(savedUser.email);
                        Team.findById(teamId)
                            .then(team => {
                                team.users.push(savedUser._id);
                                team.save()
                                    .then(result => {
                                        res.status(201).json({message: 'User created.'})
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        next(new Error('Server error - unable to save team.'))
                                    })
                            })

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
    console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const peerReviewer = req.body.peerReviewer;
    const role = req.body.role;
    const userId = req.body.userId;
    if (req.session.role !== 'Admin' && req.session.role !== 'Manager') {
        return res.status(403).json({message: 'Unauthorized to update users.'})
    };
    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({message: 'User not found.'})
            };
            user.name = name;
            user.email = email;
            user.peerReviewer = peerReviewer;
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
                send([req.body.email], 'Password Reset',
                    `
                        <h1>Password Reset</h1>
                        <p>You requested a password reset.</p>
                        <p>Click this <a href="http://localhost:3000/pass-reset/${token}">link</a> to set a new password.</p>
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
    User.findOne({resetToken: token})
        .then(user => {
            if (user.resetTokenExpiration < Date.now()) {
                return res.status(422).json({message: 'Unauthorized token.'})
            };
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
    console.log('Middleware accessed.')
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
                            team.users = team.users.filter(Id => Id.toString() !== userId.toString());
                            team.save()
                                .then(result => {
                                    Update.find()
                                        .then(updates => {
                                            updates.forEach(update => {
                                                update.acknowledged = update.acknowledged.filter(id => id.toString() !== userId.toString());
                                                update.notAcknowledged = update.notAcknowledged.filter(id => id.toString() !== userId.toString());
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
    if (idArray.length === 0) {
        return res.status(422).json({message: 'Array is empty'})
    }
    let names = [];
    User.find()
        .then(users => {
            users.forEach(user => {
                const foundIndex = idArray.find(id => id === user._id.toString());
                if (foundIndex) {
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