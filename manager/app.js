var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var serialport = require('serialport');
var http = require('http');
var mysql = require('mysql');
var fs = require('fs');

var routes = require('./routes/index');
var users = require('./routes/users');
var coffeeMarathon = require('./routes/coffeeMarathon');

var app = express();
//var server = http.createServer(app);
//var io = require('socket.io').listen(server);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req, res){
  var id = "";
  var name = "未登録IDです";
    
  if(!req.query.id){
    console.log("get error!");
  }
  else{
    id = req.query.id;
    //idでユーザー名をとってくる
    var sql = "select name from test_id where id = '" + id +  "'";

    //DBに接続
    connection.query(sql, function (err, rows) {
      if(err){
        console.log("table SQL error!",err);
      }

      if(rows.length != 0){
        name = rows[0].name;
      }
      //res.render(name);
      res.json({'name': name}); 
    });
  }
});

//postでjsonという名前のパラメータで渡されてくるJSONを読み込む
app.post('/', function(req, res){

  if(req.body){
    var json = req.body.json;
  }
  else{
    console.log("Error! post json cannot read");
    return;
  }

  //jsonのデータをだす
  var id = JSON.parse(json).id;
  var date = JSON.parse(json).date;
  var drink = JSON.parse(json).drink;
  var price;
  var user_name;

  if(drink == 0){
    drink = "Barsita";
    price = 30;
  }
  else if(drink == 1){
    drink = "Dolce gusto";
    price = 60;
  }
  else if(drink == 2){
     drink = "Dolce gusto w/ milk";
     price = 120;
  }
  else if(drink == 3){
     drink = "Special T";
     price = 60;
  }
  else{
    console.log("Error! cannot find id=" + id + " drink name");
    return;
  }
  
  //idでユーザ名をとってくる
  var sql = "select name from test_id where id = '" + id +  "'";
  connection.query(sql, function (err, rows) {
    if(err){
      console.log("table SQL error!",err);
    }

    if(rows.length != 0){
      user_name = rows[0].name;
    }
    else{
      console.log("ID is not defined");
      return;
    }

    //id,date,drinkをjsonでpostするとデータベースを更新する
    var insertSql = "INSERT INTO TEST VALUES('" + date + "','"
                    + user_name  + "','"
                    + drink  + "','"
                    + price + "');";
    
    console.log(insertSql);
    connection.query(insertSql, function (err, rows) {
      if(err){
        console.log("insert data to DB failed.");
        console.log(err);
        return;
      }
    });

  });
});


app.listen(3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', routes);
app.use('/users', users);
app.use('/coffeeMarathon', coffeeMarathon);



// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//DB settings
var connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASS || 'NojiNoji',
  database: process.env.DB_NAME || 'CoffeeManager_db'
});

//connect with DB
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('DBconnected as id ' + connection.threadId);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

module.exports = app;

