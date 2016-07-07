var express = require('express');
var bodyParser = require('body-parser');
var async = require('async');

var connection = require('../mysql_connect')

var router = express.Router();
var jsonParser = bodyParser.json();

// Database info
const table_id = "test_id";
const table_drinks = "test_drinks";
const table_journal = "test";

router.get('/', function(req, res, next) {
	res.send('Hello world!');
})

router.get('/user', function(req, res, next) {
	var id = "";
	var name = "unregistered";

	if (!req.query.id) {
		console.log("no id");
		res.json({'name': name});
	}
	else {
		id = req.query.id;
		var sql = "SELECT name FROM "
			+ table_id
			+ " WHERE id = '"
			+ id
			+ "';";
		connection.query(sql, function(err, rows) {
			if (err) {
				console.log("SQL error:", err);
			}
			if (rows.length > 0) {
				name = rows[0].name;
			}
			res.json({'name': name});
		});
	}
});

router.post('/payment', jsonParser, function(req, res, next) {
	if (!req.body) {
		return res.sendStatus(400);
	}

	var id = req.body.id;
	var date = req.body.date;
	var drink_id = req.body.drink;
	var drink_name;
	var user_name;
	var price;

	// get drink name from db
	var sql_drink = "SELECT name, price FROM "
		+ table_drinks
		+ " where id = "
		+ drink_id
		+ ";"
	
	// get user name from db
	var sql_name = "SELECT name FROM "
		+ table_id
		+ " where id = '"
		+ id
		+ "';"

	async.parallel([
		function(callback) {
			console.log(sql_drink);
			connection.query(sql_drink, function(err, rows) {
				if (err) {
					throw err;
				}
				if (rows.length > 0) {
					drink_name = rows[0].name;
					price = rows[0].price;
					console.log(rows[0]);
				}
				callback();
			});
		},
		function(callback) {
			console.log(sql_name);
			connection.query(sql_name, function(err, rows) {
				if (err) {
					throw err;
				}
				if (rows.length > 0) {
					user_name = rows[0].name;
					console.log(rows[0]);
				}
				callback();
			});
		}
	], function(err) {
		if (err) {
			throw err;
		}

		// 例外処理
		if (user_name == null) {
			res.status(400);
			res.send();
			return;
		}
		if (drink_name == null) {
			res.status(400);
			res.send();
			return;
		}

		// 購入情報をDBに記録
		var sql_insert = "INSERT INTO "
			+ table_journal
			+ " (time, name, item, price) VALUES ("
			+ "'" + date + "', "
			+ "'" + user_name + "', "
			+ "'" + drink_name + "', "
			+ price + ");"
		console.log(sql_insert);
		connection.query(sql_insert, function(err) {
			if (err) {
				throw err;
			} else {
				res.send("success");
			}
		});
	});
});

module.exports = router;

