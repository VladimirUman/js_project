var mongoose = require('mongoose');
var Coment = mongoose.model('Coment');
var Checkin = mongoose.model('Checkin');

exports.allComents = function(req, res) {
  Coment.find({checkinId: req.params.checkinId}, function (err, coments) {
    if (err)
      res.send(err);
    res.json(coments);
  });
};

exports.createComent = function(req, res) {
  var newComent = new Coment(req.body);
  newComent.name = req.user.name;
  newComent.checkinId = req.params.checkinId;
  newComent.save(function(err, coment) {
    if (err)
      res.send(err);
    Coment.find({checkinId: coment.checkinId}, {raiting: 1}, function (err, raiting) {
      if (err)
        res.send(err);
      var sum = 0;
      for (var i = 0; i < raiting.length; i++ ) {
        sum += raiting[i].raiting;
      }
      var resultRaiting = (sum == 0) ? sum : Math.round(sum / raiting.length * 10) / 10;
      //console.log(raiting);
      //console.log(resultRaiting);
      Checkin.findOneAndUpdate({_id: coment.checkinId}, { $set: { votes: raiting.length, raiting: resultRaiting }}, {new: true}, function(err, coment) {
        if (err)
          res.send(err);
        res.status(200).json({ message: "OK", comment: coment });
        //console.log(coment);
      });
    });
  });
};


exports.readComent = function(req, res) {
  Coment.findById(req.params.comentId, function(err, coment) {
    if (err)
      res.send(err);
    res.json(coment);
  });
};


exports.updateComent = function(req, res) {
  Coment.findOneAndUpdate({_id: req.params.comentId}, req.body, {new: true}, function(err, coment) {
    if (err)
      res.send(err);
    res.json(coment);
  });
};


exports.deleteComent = function(req, res) {
  Coment.remove({
    _id: req.params.comentId
  }, function(err, coment) {
    if (err)
      res.send(err);
    res.json({ message: 'Comment successfully deleted' });
  });
};
