const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const updateSchema = new Schema({
    teamId: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    acknowledged: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    notAcknowledged: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    files: [{
        type: String,
        required: false
    }],
});

module.exports = mongoose.model('Update', updateSchema);