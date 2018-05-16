var express = require('express');
var router = express.Router();
const config = require('../../config.json');
const mongoose = require('mongoose');
const User = require('../../models/userModel.js');
mongoose.connect(config.dbUrl);
const db = mongoose.connection;
const userModel = db.model('test_users', User);

router.get('/', function(req, res) {
  userModel.find({}, function (err, users) {
    if (err)
      res.send(err);
    res.json(users);
  });
});

router.post('/', function(req, res) {
  var newUser = new userModel(req.body);
  newUser.save(function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
});


router.get('/:userId', function(req, res) {
  userModel.findById(req.params.userId, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
});


router.put('/:userId', function(req, res) {
  userModel.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
});


router.delete('/:userId', function(req, res) {
  userModel.remove({
    _id: req.params.userId
  }, function(err, user) {
    if (err)
      res.send(err);
    res.json({ message: 'User successfully deleted' });
  });
});


module.exports = router;
