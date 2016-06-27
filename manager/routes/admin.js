var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var async = require('async');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'user',
	password: 'NojiNoji',
	database: 'CoffeeManager_db'
});

var table_id = "test_id";

connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('DBconnected as id ' + connection.threadId);
});

router.get('/', function(req, res, next) {
	var params = {};
	var users = [];
	var sql = "SELECT * FROM " + table_id + ";";
	connection.query(sql, function(err, rows) {
		if (err) throw err;
		params.users = rows;
		console.log(params);
		res.render('admin', params);
	});
});

module.exports = router;