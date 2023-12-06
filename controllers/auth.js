const User = require('../models/user');
const Team = require('../models/team');

const bcrypt = require('bcrypt');

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let user;
    User.find({email: email})
        .then(foundUser => {
            user = foundUser[0];
            if (!user) {
                return res.status(422).json({message: 'Email and password combination not found.'})
            };
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (!doMatch) {
                        return res.status(422).json({message: 'Email and password combination not found.'})
                    };
                    const stringifiedUserId = user._id.toString();
                    req.session.teamId = user.teamId;
                    req.session.userId = stringifiedUserId;
                    req.session.role = user.role;
                    req.session.name = user.name;
                    if (user.teamId !== 'Admin') {
                        Team.findById(user.teamId)
                        .populate('users')
                        .populate('escalations')
                        .populate('updates')
                        .then(team => {
                            team.users = team.users.map(user => user.password = 'redacted');
                            user.password = 'redacted';
                            const package = {team: team, user: user};
                            res.status(200).json(package);
                        })
                    } else {
                        const adminPackage = {team: undefined, user: user};
                        res.status(200).json(adminPackage);
                    }
                })
        })
        .catch(err => {
            console.log(err);
            next(new Error('Server error = Unable to query user.'))
        })
};

exports.postLogout = (req, res, next) => {
    console.log(req.session);
    req.session.destroy(err => {
        console.log(err);
    })
    res.status(200).json({message: 'Logged out.'})
}