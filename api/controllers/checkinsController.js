var mongoose = require('mongoose');
var Checkin = mongoose.model('Checkin');

exports.allCheckins = function(req, res) {
  Checkin.find({}, function (err, checkins) {
    if (err)
      res.send(err);
    res.json(checkins);
  });
};

exports.createCheckin = function(req, res) {
  var newCheckin = new Checkin(req.body);
  newCheckin.save(function(err, checkin) {
    if (err)
      res.send(err);
    res.json(checkin);
  });
};


exports.readCheckin = function(req, res) {
  Checkin.findById(req.params.checkinId, function(err, checkin) {
    if (err)
      res.send(err);
    res.json(checkin);
  });
};


exports.updateCheckin = function(req, res) {
  Checkin.findOneAndUpdate({_id: req.params.checkinId}, req.body, {new: true}, function(err, checkin) {
    if (err)
      res.send(err);
    res.json(checkin);
  });
};


exports.deleteCheckin = function(req, res) {
  Checkin.remove({
    _id: req.params.checkinId
  }, function(err, checkin) {
    if (err)
      res.send(err);
    res.json({ message: 'Checkin successfully deleted' });
  });
};
