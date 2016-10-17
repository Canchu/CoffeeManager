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

// 商品情報の取得
router.get('/', (req, res, next) => {
  const sql = `SELECT * FROM ${table_drinks};`;
  getSqlConnection((err, connection) => {
    connection.query(sql, (err, rows) => {
      connection.release();
      if (err) {
        throw err;
        res.status(400);
        return;
      }
      res.json(rows);
    });
  });
});

// 商品価格の更新
router.put('/', jsonParser, (req, res, next) => {
  if (!(req.body)) {
    console.log(req.body);
    return res.sendStatus(400);
  }
  getSqlConnection((err, connection) => {
    async.each(req.body, (data, callback) => {
      const sql = `UPDATE ${table_drinks} SET price = ${data.price} where id = ${data.id};`;
      console.log(sql);
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
