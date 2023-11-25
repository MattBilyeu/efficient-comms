const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const escalationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    notes: [{
        type: String,
        required: true
    }],
    files: [{
        type: String,
        required: false
    }],
    teamId: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    stage: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Escalation', escalationSchema);