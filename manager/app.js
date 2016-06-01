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
var hello = require('./routes/hello');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/hello', hello);

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

//getパラメータを受けとり、からでなければDBに問い合わせ、ユーザー名を返す
app.get('/',function(req, res)){
  var id = "";

  if(req.query.id){
    id = req.query.id;
  }

  //idでユーザー名をとってくる
  var sql = "select name from test_id where id = '" + id +  "'";

  //DBに接続
  connection.query(sql, function (err, rows) {
    name = rows;
    console.log(rows);
    
    if(err){
        console.log("table SQL error!",err);
    }

    if(name == null || name == ""){
        console.log("not registerd ID!");
        return;
    }
    
    console.log(name);
    res.json({'name': name}); 
}

//postでJSONを読み込む

app.post('/', function(req, res){
  console.log(req);

  if(req.body){
    var json = req.body;
  }
  else{
    console.log("Error! post json cannot read");
    return;
  }

  //jsonのデータをだす
  var id = JSON.parse(json).ID;
  var time = JSON.parse(json).Time;
  var drink = JSON.parse(json).Drink;
  var price;

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
  else if(drink == 3{
     drink = "Special T";
     price = 60;
  }
  else{
    console.log("Error! cannot find id=" + id + " drink name");
    return;
  }

  //id,date,drinkをjsonでpostするとデータベースを更新する
  var insertSql = "INSERT INTO TEST VALUES('" +
                    time  + "','"
                    name  + "','"
                    drink  + "','"
                    price + "')'";

  connection.query(insertSql, function (err, rows) {
    if(error){
      console.log("insert data to DB failed.");
      return;
    }
  });
});


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//connect DB
var connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASS || 'NojiNoji',
  database: process.env.DB_NAME || 'CoffeeManager_db'
});


  
// クライアントが接続してきたときの処理
io.sockets.on('connection', function(socket) {
    // メッセージを受けたときの処理
    socket.on('message', function(data) {
        //console.log(data.value);
        // つながっているクライアント全員に送信
        socket.broadcast.json.emit('message', { value: data.value });

        console.log('Client sent us: ' + data.value);
        sp.write(data.value, function(err, bytesWritten) {
            console.log('bytes written: ', bytesWritten);
        });
    });

    // クライアントが切断したときの処理
    socket.on('disconnect', function(){
        console.log("disconnect");
    });
});

//connect with DB
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('DBconnected as id ' + connection.threadId);
});


module.exports = app;
