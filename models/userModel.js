const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Why no name'],
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Why no email']
    },
    password: {
        type: String,
        required: [true, 'Why no password']
    },
    twitter_account: String,
    admin: {
        type: Boolean,
        default: false
    }
});

//UserSchema.methods.comparePassword = function(password) {
//  return bcrypt.compareSync(password, this.password);
//};

UserSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema, 'test_users');
