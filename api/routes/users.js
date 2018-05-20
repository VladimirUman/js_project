var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
User = mongoose.model('User');
var bcrypt = require('bcrypt');


router.get('/', function(req, res) {
  User.find({}, function (err, users) {
    if (err)
      res.send(err);
    res.json(users);
  });
});

router.post('/', function(req, res) {
  var newUser = new User(req.body);
  newUser.password = bcrypt.hashSync(req.body.password, 10);
  newUser.admin = false;
  newUser.save(function(err, user) {
    if (err) {
      return res.status(400).send({ message: err });
    } else {
      user.password = undefined;
      return res.json(user);
    }
  });
});


router.get('/:userId', function(req, res) {
  User.findById(req.params.userId, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
});


router.put('/:userId', function(req, res) {
  User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
});


router.delete('/:userId', function(req, res) {
  User.remove({
    _id: req.params.userId
  }, function(err, user) {
    if (err)
      res.send(err);
    res.json({ message: 'User successfully deleted' });
  });
});


module.exports = router;
