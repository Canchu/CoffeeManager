var express = require('express');
var router = express.Router();
var async = require('async');

var connection = require('../mysql_connect.js');

var rowData;

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

  async.waterfall([
    (callback) => {
      // ユーザ一覧取得
      const sql = "select name from test_id";
      connection.query(sql, (err, rows) => {
        if (err) throw err;
        const userNames = rows.map((data) => {
          return data.name;
        });
        callback(null, userNames);
      })
    },
    (userNames, callback) => {
      // ユーザごとの利用料金算出
      async.map(userNames, (name, callback) => {
        const sql = `select count(*) from test where name = '${name}' and time >= '${startDate}' and time <= '${endDate}';`;
        console.log(sql);
        connection.query(sql, (err, rows) => {
          if (err) throw err;
          callback(null, { name, qty: rows[0]['count(*)'] });
        });
      }, (err, results) => {
        if (err) throw err;
        results.sort((a, b) => {
          if (a.qty > b.qty) return -1;
          return 1;
        });
        callback(null, results);
      });
    },
    (results, callback) => {
      console.log(results);
      res.render('coffeeMarathon', {
        year,
        month,
        results,
      });
    }
  ]);

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
  var sql = "select * from test where time >= '" + startDate + "'and time <= '" + endDate + "'";
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
