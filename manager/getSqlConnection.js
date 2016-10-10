var fs = require('fs');
var mysql = require('mysql');

var sql_secret = JSON.parse(fs.readFileSync('./../secrets/sql_secret.json', 'utf8'));
var db_config = {
    host: sql_secret.dev.host,
    database: sql_secret.dev.db,
    user: sql_secret.dev.user,
    password: sql_secret.dev.passwd,
};
var pool = mysql.createPool(db_config);
var getConnection = (callback) => {
  pool.getConnection((err, connection) => {
    callback(err, connection);
  });
};

module.exports = getConnection;
