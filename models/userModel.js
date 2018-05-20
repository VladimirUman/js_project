const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        //unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    twitter_account: String,
    admin: {
        type: Boolean,
        default: false
    }
});

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema, 'test_users');
