var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('admin', { title: 'Admin Page' });
});

router.get('/hello', function(req, res, next) {
	res.send('Hello! Kin-iro mosaic');
})

module.exports = router;