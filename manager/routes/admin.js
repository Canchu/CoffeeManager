var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');

const table_journal = "test";
const table_id = "test_id";
const table_drinks = "test_drinks";

router.get('/', function(req, res, next) {
	data = {};
	data.title = '管理者ページ';
	var sql = "SELECT * FROM " + table_journal + " order by time desc limit 5;";
	connection.query(sql, function(err, rows) {
		if (err) throw err;
		data.recent = rows;
		data.recent.forEach(function(val) {
			val.time = dateFormat(val.time, "yyyy-mm-dd dddd h:MM:ss");
			console.log(val.time);
		});
		res.render('admin', data);
	});
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
