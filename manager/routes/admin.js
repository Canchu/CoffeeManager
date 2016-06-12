var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'user',
	password : 'NojiNoji',
	database : 'CoffeeManager_db',
	debug: true
});

/* GET users listing. */
router.get('/', function(req, res, next) {
	var users = [];

	connection.query({
		sql: 'SELECT * FROM `test_id`'
	}, function (err, results, fields) {
		results.forEach(function (element, index, array) {
			console.log(element);
			users.push({id: element.id, name: element.name});
		});
		console.log(users);

		renderdata = {
			title: 'admin page',
			users: users
		}
		console.log(renderdata);
		res.render('admin', renderdata);
	});
});

router.get('/log', function(req, res, next) {
	var logs = [];
	connection.query({
		sql: 'SELECT * FROM test'
	}, function (err, results, fields) {
		results.forEach(function (element, index, array) {
			logs.push({date: element.time, name: element.name, drink: element.item});
			console.log(element.time);
		});

		renderdata = {
			log: logs
		};

		res.render('log', renderdata);
	});
})

router.get('/hello', function(req, res, next) {
	res.send('Hello! Kin-iro mosaic');
});

module.exports = router;