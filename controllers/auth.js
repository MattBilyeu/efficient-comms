const User = require('../models/user');
const Team = require('../models/team');

const bcrypt = require('bcrypt');

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let user;
    User.find({email: email})
        .then(foundUser => {
            user = foundUser;
            if (!user) {
                return res.status(422).json({message: 'Email and password combination not found.'})
            };
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (!doMatch) {
                        return res.status(422).json({message: 'Email and password combination not found.'})
                    };
                    req.session.teamId = user.teamId;
                    req.session.userId = user._Id;
                    req.session.role = user.role;
                    req.session.name = user.name;
                    Team.findById(user.teamId)
                        .populate('users')
                        .populate('escalations')
                        .populate('updates')
                        .then(team => {
                            team.users = team.users.map(user => user.password = 'redacted');
                            res.status(200).json(team);
                        })
                })
        })
        .catch(err => {
            console.log(err);
            next(new Error('Server error = Unable to query user.'))
        })
};