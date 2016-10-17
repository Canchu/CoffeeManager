var express = require('express');
var router = express.Router();

var marathon = require('./marathon/index');
var admin = require('./admin/index');
var api = require('./api/index');

router.use('/', marathon);
router.use('/admin', admin);
router.use('/api', api);

module.exports = router;
