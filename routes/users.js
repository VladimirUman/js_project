var express = require('express');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
User = mongoose.model('User');
var bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {

  User.find({}, function (err, users) {
    //console.log(users);
    res.render('users', { userList: users });
  });
});

router.get('/add', function(req, res, next) {
  res.render('user_add');
});

router.post('/add', function(req, res, next) {
  const newUser = new User(req.body);
  newUser.password = bcrypt.hashSync(req.body.password, 10);
  newUser.save(function(error, user){
    res.redirect('/users');
  });
});

module.exports = router;
