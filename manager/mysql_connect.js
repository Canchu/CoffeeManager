var fs = require('fs');
var mysql = require('mysql');

var sql_secret = JSON.parse(fs.readFileSync('./../secrets/sql_secret.json', 'utf8'));

var db_config = {
    host: sql_secret.host,
    database: sql_secret.db,
    user: sql_secret.user,
    password: sql_secret.passwd,
};

var connection = mysql.createConnection(db_config);

function handleDisconnect() {
    connection.connect(function(err) {
        if(err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
        console.log('DB connected ID: ', connection.threadId);
    });

    // catch disconnection
    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

module.exports = connection;
