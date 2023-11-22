const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    teamId: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: false
    },
    peerReviewer: {
        type: Boolean,
        required: true
    },
    resetToken: {
        type: String,
        required: false
    },
    tokenExpiration: {
        type: Date,
        required: false
    }
});

module.exports = mongoose.model('User', userSchema);