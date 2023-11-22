const User = require('../models/user');
const Team = require('../models/team');
const Escalation = require('../models/escalation');

const bcrypt = require('bcrypt');
const crypto = require('crypto');

exports.createUser = (req, res, next) => {

};

exports.updateuser = (req, res, next) => {
    // Update role, peer review, or email
};

exports.resetPassword = (req, res, next) => {
    // Check expiration token from params and then update
}

exports.findUserById = (req, res, next) => {
    
};

exports.deleteUserexports = (req, res, next) => {
    // Delete any owned escalations along with user
}