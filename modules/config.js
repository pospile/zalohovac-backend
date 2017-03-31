var config = require(appRoot + "/config.json");

var mysql = require('mysql');
var pool  = mysql.createPool({
    host     : config.host,
    user     : config.user,
    password : config.pass,
    database : config.db
});



exports.GetConnection = function (callback) {
    pool.getConnection(function(err, connection) {
        callback(connection);
    });
};