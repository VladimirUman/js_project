var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var User = require('./models/userModel.js');
var Checkin = require('./models/checkinModel.js');
var bodyParser = require('body-parser');
var jsonwebtoken = require("jsonwebtoken");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mongoose = require('mongoose');
if (process.env.TEST_ENV) {
  mongoose.connect('mongodb://localhost:27017/checkin');
}
mongoose.connect('mongodb+srv://User3:test@brainbasketcheckin-h7hkk.mongodb.net/checkin');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  var token = req.headers.authorization;
  if (token) {
    jsonwebtoken.verify(token, 'mySecretWordMySecretWord', function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

var routes = require('./routes/routeList.js');
routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
