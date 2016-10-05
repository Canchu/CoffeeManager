var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');

var routes = require('./routes/index');
var users = require('./routes/users');
var coffeeMarathon = require('./routes/coffeeMarathon');
var admin = require('./routes/admin');
var api = require('./routes/api');
var basicAuth = require('basic-auth-connect');

var app = express();

var jsonParser = bodyParser.json();

var connection = ('./mysql_connect');

var admin_secret = JSON.parse(fs.readFileSync('./admin_secret.json', 'utf8'));
var admin_usr = admin_secret.username;
var admin_pass = admin_secret.password;

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// BASIC Authentification
app.all('/admin*', basicAuth(function(user, password) {
  return user === admin_usr && password === admin_pass;
}));

app.listen(3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', routes);
app.use('/users', users);
app.use('/admin', admin)
app.use('/coffeeMarathon', coffeeMarathon);
app.use('/api', api);

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

module.exports = app;

