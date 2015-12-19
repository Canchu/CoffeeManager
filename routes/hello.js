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

//console.log(tableRows);
/* GET hello page. */
router.get('/', function(req, res, next) {
	var p1 = req.query['p1'];
	var p2 = req.query.p2;
	var msg = p1 == undefined ? "" : p1 + "," + p2;
  var rowData;

    connection.query('select * from test', function (err, rows) {
        console.log(rows);
        //rowData = rows;

        res.render('hello', {
            title: 'Nojima_Hirota Lab Coffee Manager',
            data: rows
        });
    });
});

/* POST hello page. */
router.post('/', function(req, res, next) {
    var str = req.query.input1;
        res.json(
            {msg: str}
        );
});




module.exports = router;
//app.get('/hello', hello.hello);