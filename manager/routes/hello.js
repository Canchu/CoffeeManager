var express = require('express');
var mysql = require('mysql');

var router = express.Router();
 

//connect DB
var connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASS || 'NojiNoji',
  database: process.env.DB_NAME || 'CoffeeManager_db'
});


connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('DBconnected as id ' + connection.threadId);

  connection.query('select * from test', function (err, rows) {
        //console.log(rows);
    });
});


var rowData;

/* GET hello page. */
router.get('/', function(req, res, next) {
  var month = req.query.month;
  var day = new Date();

  if(month == undefined || month > 12 || month < 1){
    month = day.getMonth()+1;
  }

  var startDate = '2015-' + month + '-01';
  var endDate   = '2015-' + month + '-31';
  var sql = "select * from test where time >= '" + startDate + "'and time <= '" + endDate + "'";

  connection.query(sql, function (err, rows) {
      rowData = rows;
      if(err){
        console.log("table SQL error!",err);
      }
      res.render('hello', {
          month: month,
          //dlLink: csvFileName,
          data: rows
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