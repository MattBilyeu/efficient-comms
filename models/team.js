const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    escalations: [{
        type: Schema.Types.ObjectId,
        ref: 'Escalation',
        required: false
    }],
    updates: [{
        type: Schema.Types.ObjectId,
        ref: 'Update',
        required: false
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }]
});

module.exports = mongoose.model('Team', teamSchema);