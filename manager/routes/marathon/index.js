var express = require('express');
var router = express.Router();
var async = require('async');

var getSqlConnection = require('../../utils/getSqlConnection');

var rowData;

// Database info
const table_id = "Users";
const table_drinks = "Drinks";
const table_journal = "Journal";

/* GET hello page. */
router.get('/', function(req, res, next) {
  var year = req.query.year;
  var month = req.query.month;
  var day = new Date();

  if(year == undefined || month > 12 || month < 1){
    year = day.getFullYear();
  }

  if(month == undefined || month > 12 || month < 1){
    month = day.getMonth() + 1;
  }

  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-31`;

  async.parallel([
    (callback) => {
      // ユーザランキング作成
      getSqlConnection((err, connection) => {
        async.waterfall([
          (callbackUserRank) => {
            // ユーザ一覧取得
            const sql = `select name from ${table_id};`;
            connection.query(sql, (err, rows) => {
              if (err) throw err;
              const userNames = rows.map((data) => {
                return data.name;
              });
              callbackUserRank(null, userNames);
            });
          },
          (userNames, callbackUserRank) => {
            // ユーザごとの利用料金算出
            async.map(userNames, (name, callbackMapRowData) => {
              const sql = `select count(*) from ${table_journal} where name = '${name}' and time >= '${startDate}' and time <= '${endDate}';`;
              connection.query(sql, (err, rows) => {
                if (err) throw err;
                callbackMapRowData(null, { name, qty: rows[0]['count(*)'] });
              });
            }, (err, results) => {
              if (err) throw err;
              results.sort((a, b) => {
                if (a.qty > b.qty) return -1;
                return 1;
              });
              callbackUserRank(null, results);
            });
          },
        ], (err, results) => {
          connection.release();
          callback(null, results);
        });
      });
    },
    (callback) => {
      // 商品別売上げランキングの作成
      getSqlConnection((err, connection) => {
        async.waterfall([
          (callbackDrinkRank) => {
            // 商品一覧取得
            const sql = `select name from ${table_drinks}`;
            connection.query(sql, (err, rows) => {
              if (err) throw err;
              const drinkNames = rows.map((data) => {
                return data.name;
              });
              callbackDrinkRank(null, drinkNames);
            });
          },
          (drinkNames, callbackDrinkRank) => {
            // 商品ごとの売上数算出
            async.map(drinkNames, (name, callbackMapRowData) => {
              const sql = `select count(*) from ${table_journal} where item = '${name}' and time >= '${startDate}' and time <= '${endDate}';`;
              connection.query(sql, (err, rows) => {
                if (err) throw err;
                callbackMapRowData(null, { name, qty: rows[0]['count(*)'] });
              });
            }, (err, results) => {
              callbackDrinkRank(null, results);
            });
          },
        ], (err, results) => {
          if (err) throw err;
          connection.release();
          callback(null, results);
        });
      });
    },
  ], (err, results) => {
    // データをまとめてレンダリング
    if (err) throw err;
    res.render('coffeeMarathon', {
      year,
      month,
      userRanks: results[0],
      drinkRanks: results[1],
    });
  });

});

/* POST hello page. */
router.post('/', function(req, res, next) {
  var month = req.body['targetMonth'];
  var day = new Date();

  if(month == undefined || month > 12 || month < 1){
    month = day.getMonth()+1;
  }

  var csvFileName = "2015-"+ month + "_" + (day.getMonth()+1) + "-" + day.getDate() + "-" + day.getHours() + "-" + day.getMinutes() + "-" + day.getSeconds() + ".csv";

  var startDate = '2015-' + month + '-01';
  var endDate   = '2015-' + month + '-31';
  var sql = `select * from ${table_journal} where time >= '${startDate}' and time <= '${endDate}';`;
  var csvSql = sql + " into outfile '/Users/masakiayano/Desktop/CoffeeManager/public/" + csvFileName + "' FIELDS TERMINATED BY ',' ";
  
  connection.query(csvSql, function (err, data) {
    if(err){
        console.log("csv SQL error!", err);
    }
    res.render('hello', {
          month: month,
          data: rowData,
          csvFileName: csvFileName
      });
  });

});

module.exports = router;
