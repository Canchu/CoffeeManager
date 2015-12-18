var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var serialport = require('serialport');
var http = require('http');
var mysql = require('mysql');

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

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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


// Serial Port
var portName = '/dev/cu.usbmodem1411'; // Mac環境
var sp = new serialport.SerialPort(portName, {
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline("\n")   // ※修正：パースの単位を改行で行う
});

  
// クライアントが接続してきたときの処理
io.sockets.on('connection', function(socket) {
    console.log("connection");

    // メッセージを受けたときの処理
    socket.on('message', function(data) {
        console.log(data.value);
        // つながっているクライアント全員に送信
        //socket.broadcast.json.emit('message', { value: data.value });

        console.log('Client sent us: ' + data.value);
        sp.write(data.value, function(err, bytesWritten) {
            console.log('bytes written: ', bytesWritten);
        });
    });

    // クライアントが切断したときの処理
    socket.on('disconnect', function(){
        console.log("disconnect");
    });

    // data for Serial port 
    /*socket.on('sendSerial', function(data) {
        var receive = JSON.stringify(data);
        console.log('Client sent us: ' + receive);
        sp.write(receive, function(err, bytesWritten) {
            console.log('bytes written: ', bytesWritten);
        });
    });*/
});

//connect with DB
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('DBconnected as id ' + connection.threadId);
});


// data from Serial port
sp.on('data', function(input) {

    var buffer = new Buffer(input, 'utf8');
    var jsonData;
    try {
        jsonData = JSON.parse(buffer);
        console.log(jsonData);
    } catch(e) {
        // データ受信がおかしい場合無視する
        return;
    }

    var itemValue = 0;
    if(jsonData.item == 'Dolce Gusto' || jsonData.item == 'Special.T'){
      value = 60;
    }
    else if(jsonData.item == 'GoldBrend Barista'){
      value = 30;
    }
    else{
      value = 0;
      console.log("item name is unexpected");
    }

    var insertSql = 'INSERT INTO TEST VALUES(' +
                    jsonData.time  + ','
                    jsonData.name  + ','
                    jsonData.item  + ','
                    itemValue + ')'

    connection.query(insertSql, function (err, rows) {
      if(error){
        console.log("insert data to DB failed.");
        return;
      }
    });

    // つながっているクライアント全員に送信
    //io.sockets.emit('message', { value: jsonData.led });
});


module.exports = app;
