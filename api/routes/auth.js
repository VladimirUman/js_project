var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
User = mongoose.model('User');
var jwt = require('jsonwebtoken');


router.post('/', function(req, res) {
  if (!req.body || !req.body.name || !req.body.password) {
    res.sendStatus(400);
  }
  userModel.findOne({name: req.body.name}, function(err, result) {
    if (err) {
      res.status(500).send(err.message);
    } else if (result.length == 0) {
      res.status(422).send({message: "Not found user"});
    } else {
      var user = result;
      if (user.comparePassword(req.body.password)) {
        const payload = {
          name: user.name,
          admin: user.admin
        };
        var token = jwt.sign(payload, 'mySecretWord');
        res.status(200).send({ name: user.name, token: token })
      } else {
        res.status(422).send({message: "Wrong password"});
      }
    }
  });
});

module.exports = router;
