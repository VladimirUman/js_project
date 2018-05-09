var express = require('express');
var router = express.Router();
const config = require('../config.json');
const mongoose = require('mongoose');
const Checkin = require('./../models/checkin.js');
mongoose.connect("mongodb+srv://User3:test@brainbasketcheckin-h7hkk.mongodb.net/checkin");
const db = mongoose.connection;
const checkinModel = db.model('checkins', Checkin);
//console.log(mongoose.connection.readyState);

router.get('/', function(req, res, next) {
  res.render('index', {checkins: 'Hello!'});
});

router.get('/checkins', function(req, res, next) {
  checkinModel.find({}, function (err, checkins) {
    res.send( checkins );
  });
});

router.post('/checkins', function(req, res, next) {
  let checkin = {
    name: 'Test User',
    cord: req.body.cord,
    place: req.body.place
  };
  console.log(checkin);
  res.sendStatus( 200 );

/*
  const newCheckin = new checkinModel(checkin);
  newCheckin.save(function(error, checkin){
      console.log(error, checkin);
      //res.redirect('/');
  });
*/
});


module.exports = router;
