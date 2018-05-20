var mongoose = require('mongoose');
var User = mongoose.model('User');
var bcrypt = require('bcrypt');

exports.allUsers = function(req, res, next) {

  User.find({}, function (err, users) {
    res.render('users', { userList: users });
  });
};

exports.addUserPage = function(req, res, next) {
  res.render('user_add');
};

exports.createUser = function(req, res, next) {
  var newUser = new User(req.body);
  newUser.password = bcrypt.hashSync(req.body.password, 10);
  newUser.save(function(error, user){
    res.redirect('/users');
  });
};
