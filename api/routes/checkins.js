var express = require('express');
var router = express.Router();
const config = require('../../config.json');
const mongoose = require('mongoose');
const Checkin = require('../../models/checkinModel.js');
mongoose.connect(config.dbUrl);
const db = mongoose.connection;
const checkinModel = db.model('checkins', Checkin);

router.get('/', function(req, res) {
  checkinModel.find({}, function (err, checkins) {
    if (err)
      res.send(err);
    res.json(checkins);
  });
});

router.post('/', function(req, res) {
  var newCheckin = new checkinModel(req.body);
  newCheckin.save(function(err, checkin) {
    if (err)
      res.send(err);
    res.json(checkin);
  });
});


router.get('/:checkinId', function(req, res) {
  checkinModel.findById(req.params.checkinId, function(err, checkin) {
    if (err)
      res.send(err);
    res.json(checkin);
  });
});


router.put('/:checkinId', function(req, res) {
  checkinModel.findOneAndUpdate({_id: req.params.checkinId}, req.body, {new: true}, function(err, checkin) {
    if (err)
      res.send(err);
    res.json(checkin);
  });
});


router.delete('/:checkinId', function(req, res) {
  checkinModel.remove({
    _id: req.params.checkinId
  }, function(err, checkin) {
    if (err)
      res.send(err);
    res.json({ message: 'Checkin successfully deleted' });
  });
});


module.exports = router;
