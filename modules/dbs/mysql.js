var config = require("../config.js");

var insert_into = function (tbName, object_keys, object_values, callback) {
    console.log("Data integrity test will be runned now");
    if (object_keys.length != object_values.length) {console.log("Error: data integrity invalid");return;}

    var sql = "insert ignore into " + tbName + "(";
    object_keys.forEach(function(key){
        sql += key + ",";
    });
    sql = sql.substring(0, sql.length - 1);
    sql += ") ";
    sql += "values (";
    object_values.forEach (function (value) {
        if (typeof value == "string")
        {
            sql += "'"+ value + "',";
        }
        else
        {
            sql += value + ",";
        }
    });

    sql = sql.substring(0, sql.length - 1);
    sql += ");";
    console.log(sql);
    config.GetConnection(function (connection) {
        connection.query(sql, function (error, results, fields) {
            if (error) callback(error);
            else callback(results);
            connection.release();
        });
    });
};

/*
 tbName (name from select is done), what (is what you want to select from), join (sql query part - what you want to join), where (sql query part - what you want to filter at)
 */
var select_from = function (tbName, what, join, where, callback) {
    //"select what from tbName join where";
    var sql = "select "+what;
    if (tbName != null)
    {
        sql += " from " + tbName;
    }
    if (join != null)
    {
        sql += " " + join;
    }
    if (where != null)
    {
        sql += " " + where;
    }
    sql += ";";
    console.log(sql);
    config.GetConnection(function (connection) {
        connection.query(sql, function (error, results, fields) {
            callback(results);
            connection.release();
        });
    });
};

exports.InsertInto = insert_into;
exports.SelectFrom = select_from;
/*
 insert_into("user", ["id", "name", "pass"], [1, "rokamis", "123456"], function (data) {

 });
 */
