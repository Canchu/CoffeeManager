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
var table_drinks = "test_drinks";

connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('DBconnected as id ' + connection.threadId);
});

router.get('/', function(req, res, next) {
	res.render('admin', {});
});

router.get('/users', function(req, res, next) {
	var data = {};
	data.title = 'ユーザ情報'
	var sql = "SELECT * FROM " + table_id + ";";
	connection.query(sql, function(err, rows) {
		if (err) throw err;
		data.users = rows;
		res.render('admin_users', data);
	});
});

router.get('/drinks', function(req, res, next) {
	var data = {};
	data.title = '商品情報'
	var sql = "SELECT * FROM " + table_drinks + ";";
	connection.query(sql, function(err, rows) {
		if (err) throw err;
		data.drinks = rows;
		res.render('admin_drinks', data);
	});
});

module.exports = router;