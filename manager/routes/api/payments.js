"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var async = require('async');

var getSqlConnection = require('../../getSqlConnection')

var router = express.Router();
var jsonParser = bodyParser.json();

// Database info
const table_id = "Users";
const table_drinks = "Drinks";
const table_journal = "Journal";

// get payment info
router.get('/', (req, res) => {
  const sql = `SELECT * FROM ${table_journal} order by time desc limit 10`;
  getSqlConnection((err, connection) => {
    connection.query(sql, (err, rows) => {
      connection.release();
      if (err) {
        console.log(err);
        res.sendStatus(400);
        return;
      }
      res.json(rows);
    });
  });
});

// get payment info year and month
router.get('/:year/:month', (req, res) => {
  const year = parseInt(req.params.year, 10);
  const month = parseInt(req.params.month, 10);
  // validation
  if (month > 12) {
    res.sendStatus(400);
    return;
  }
  const sql = `SELECT * FROM ${table_journal} WHERE DATE_FORMAT(time, '%Y%m') = '${year}${('0' + month).slice(-2)}';`;
  console.log(sql);
  getSqlConnection((err, connection) => {
    connection.query(sql, (err, rows) => {
      connection.release();
      if (err) {
        console.log(err);
        res.sendStatus(400);
        return;
      }
      res.json(rows);
    });
  });
});

// post payment information
router.post('/', jsonParser, (req, res, next) => {
  if (!(req.body.id && req.body.drink)) {
    return res.sendStatus(400);
  }

  const id = req.body.id;
  const drink_id = req.body.drink;
  let drink_name;
  let user_name;
  let price;

  getSqlConnection((err, connection) => {
    async.parallel([
      (callback) => {
        // get drink info from db
        const sql = `SELECT name, price FROM ${table_drinks} where id = ${drink_id};`;
        connection.query(sql, (err, rows) => {
          if (err) {
            throw err;
          }
          if (rows.length > 0) {
            drink_name = rows[0].name;
            price = rows[0].price;
          }
          callback();
        });
      },
      (callback) => {
        // get user info from db
        const sql = `SELECT name FROM ${table_id} where id = '${id}';`;
        connection.query(sql, (err, rows) => {
          if (err) {
            throw err;
          }
          if (rows.length > 0) {
            user_name = rows[0].name;
          }
          callback();
        });
      }
    ], (err) => {
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
      const sql = `INSERT INTO ${table_journal} (time, name, item, price, paid) VALUES (NOW(), '${user_name}', '${drink_name}', ${price}, false);`;
      connection.query(sql, (err) => {
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

module.exports = router;
