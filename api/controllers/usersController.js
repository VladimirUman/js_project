var mongoose = require('mongoose');
var User = mongoose.model('User');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


exports.auth = function(req, res) {
  if (!req.body || !req.body.name || !req.body.password) {
    res.sendStatus(400);
  }
  User.findOne({name: req.body.name}, function(err, user) {
    if (err) {
      res.status(500).send(err.message);
    } else if (!user) {
      res.status(400).send({message: "Not found user"});
    } else {
      if (user.comparePassword(req.body.password) && !req.user) {
        var token = jwt.sign({ name: user.name, admin: user.admin }, 'mySecretWordMySecretWord', { expiresIn: '10h'});
        res.status(200).send({message: "OK", name: user.name, token: token });
      } else {
        res.status(400).send({message: "Wrong password"});
      }
    }
  });
};


exports.loginRequired = function(req, res, next) {
  console.log(req.user);
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};


exports.allUsers = function(req, res) {
  User.find({}, function (err, users) {
    if (err)
      res.send(err);
    res.json(users);
  });
};

exports.createUser = function(req, res) {
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
};


exports.readlUser = function(req, res) {
  User.findById(req.params.userId, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};


exports.updateUser = function(req, res) {
  User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};


exports.deleteUser = function(req, res) {
  User.remove({
    _id: req.params.userId
  }, function(err, user) {
    if (err)
      res.send(err);
    res.json({ message: 'User successfully deleted' });
  });
};
