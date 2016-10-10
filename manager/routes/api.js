var express = require('express');
var bodyParser = require('body-parser');
var async = require('async');

var getSqlConnection = require('../getSqlConnection')

var router = express.Router();
var jsonParser = bodyParser.json();

// Database info
const table_id = "Users";
const table_drinks = "Drinks";
const table_journal = "Journal";

router.get('/', (req, res, next) => {
	res.send('Hello world!');
})

// get username by nfcid
router.get('/user', (req, res, next) => {
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
		getSqlConnection((err, connection) => {
			connection.query(sql, (err, rows) => {
				connection.release();
				if (err) {
					console.log("SQL error:", err);
				}
				if (rows.length > 0) {
					name = rows[0].name;
				}
				res.json({'name': name});
			});
		});
	}
});

// create a new user
router.post('/user', jsonParser, (req, res, next) => {
	if(!(req.body.id && req.body.name && req.body.email && req.body.password)) {
		res.sendStatus(400);
		return;
	}
	const sql_insert = "INSERT INTO "
		+ table_id
		+ " (id, name, email, password) VALUES ("
		+ "'" + req.body.id + "', "
		+ "'" + req.body.name + "', "
		+ "'" + req.body.email + "', "
		+ "'" + req.body.password + "');"
	getSqlConnection((err, connection) => {
		connection.query(sql_insert, (err) => {
			connection.release();
			if (err) {
				if (err.code === 'ER_DUP_ENTRY') {
					res.status(409);
					res.send(err.code);
					return;
				}
				res.sendStatus(400);
				return;
			}
			res.sendStatus(201);
		});
	});
});

// delete a user
router.delete('/user', jsonParser, (req, res, next) => {
	if (!req.body.id) {
		res.sendStatus(400);
		return;
	}
	const sql = `DELETE FROM ${table_id} WHERE id = '${req.body.id}'`;
	getSqlConnection((err, connection) => {
		connection.query(sql, (err) => {
			connection.release();
			if (err) {
				console.log(err);
				res.sendStatus(400);
				return;
			}
			res.sendStatus(204);
		});
	});
});

// post payment information
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

	getSqlConnection((err, connection) => {
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
				connection.release();
				res.status(400);
				res.send();
				return;
			}
			if (drink_name == null) {
				connection.release();
				res.status(400);
				res.send();
				return;
			}

			// 購入情報をDBに記録
			var sql_insert = "INSERT INTO "
				+ table_journal
				+ " (time, name, item, price, paid) VALUES ("
				+ "'" + date + "', "
				+ "'" + user_name + "', "
				+ "'" + drink_name + "', "
				+ price + ","
				+ 'false' + ");"
			console.log(sql_insert);
			connection.query(sql_insert, function(err) {
				connection.release();
				if (err) {
					throw err;
				} else {
					res.sendStatus(201);
				}
			});
		});
	});
});

// 商品情報の取得
router.get('/drink', function(req, res, next) {
	var data = { drinks: [] };

	var sql_drink = "SELECT * FROM " + table_drinks + ";";
	getSqlConnection((err, connection) => {
		connection.query(sql_drink, function(err, rows) {
			connection.release();
			if (err) {
				throw err;
				res.status(400);
			}
			data.drinks = rows;
			console.log(data);
			res.json(JSON.stringify(data));
		});
	});
});

// 商品価格の更新
router.put('/drink', jsonParser, (req, res, next) => {
	if (!req.body.prices) {
		return res.sendStatus(400);
	}
	getSqlConnection((err, connection) => {
		async.each(req.body.prices, (data, callback) => {
			const sql = `UPDATE ${table_drinks} SET price = ${data.price} where id = ${data.id};`;
			connection.query(sql, (err, rows) => {
				if (err) throw err;
				callback();
			});
		}, (err) => {
			connection.release();
			if (err) {
				throw err;
				res.sendStatus(400);
			}
			res.sendStatus(200);
		});
	});
});

module.exports = router;

