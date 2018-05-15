var express = require('express');
var router = express.Router();
const config = require('../config.json');
const mongoose = require('mongoose');
const User = require('./../models/user.js');
mongoose.connect("mongodb+srv://User3:test@brainbasketcheckin-h7hkk.mongodb.net/checkin");
const db = mongoose.connection;
const userModel = db.model('test_users', User);
//console.log(mongoose.connection.readyState);

router.get('/', function(req, res, next) {

  userModel.find({}, function (err, users) {
    //console.log(users);
    res.render('users', { user_list: users });
  });
});

router.get('/add', function(req, res, next) {
  res.render('user_add');
});

router.post('/add', function(req, res, next) {
  let user = {
    name: req.body.firstname,
    email: req.body.email,
    password: req.body.password,
    twitter_account: req.body.twitname
  }

  const newUser = new userModel(user);
  newUser.save(function(error, user){
      console.log(error, user);
      res.redirect('/users');
  });

});

module.exports = router;
