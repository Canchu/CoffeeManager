var express = require('express');
var bodyParser = require('body-parser');
var async = require('async');

var router = express.Router();
var jsonParser = bodyParser.json();

var users = require('./users');
var payments = require('./payments');
var drinks = require('./drinks');

router.get('/', (req, res, next) => {
  res.send('Hello world!');
});

router.use('/users', users);
router.use('/payments', payments);
router.use('/drinks', drinks);

module.exports = router;
