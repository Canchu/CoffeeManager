var mysql = require('mysql');

var db_config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASS || 'NojiNoji',
    database: process.env.DB_NAME || 'CoffeeManager_db'
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
