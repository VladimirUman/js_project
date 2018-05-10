const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// ObjectId = Schema.ObjectId;

const User = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: String,
    password: {
        type: String,
        required: true
    },
    twitter_account: String,
});

module.exports = User;
