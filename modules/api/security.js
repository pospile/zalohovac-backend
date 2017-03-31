var db = require("./db.js");
var config = require("../config.js");
var bcrypt = require('bcryptjs');

var TokenGenerator = require( 'token-generator' )({
    salt: require("../config.json").salt,
    timestampMap: 'abcdefghij', // 10 chars array for obfuscation proposes
});

/*
 Create user in database (at least customer account should already exists)
 name            = name of user in database
 pass            = password chosen by user (none hashed)
 driver_customer = {driver: [driver_id], customer: [customer_id]}
 */
var CreateUser = function (name, pass, driver_customer)
{
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(pass, salt);

    if (bcrypt.compareSync(pass, hash))
    {
        console.log("Password hashed as: " + hash);
    }



    config.GetConnection(function (connection) {
        var sql = "insert into customer (name, pass";
        var values = "values ('" + name + "', '" + hash + "'";

        if (driver_customer != undefined)
        {
            if (driver_customer.driver != undefined)
            {
                sql += ", driver";
                values += ", " + driver_customer.driver;
            }
            if (driver_customer.customer != undefined)
            {
                sql += ", customer";
                values += ", " + driver_customer.customer;
            }
        }

        sql += ") ";
        values += ");"
        console.log("query: " + sql + values);
        db.InsertInto("user", ["name", "pass", "permission"], [name, hash, 0], function (data) {
            console.log("User is saved now.");
            //console.log(data);
        });
    });
};

var Tokenize = function (user, pass, ip, valid, callback) {
    db.SelectFrom("user", "*", null, "where name = "+require("./util.js")._stringify(user), function (data) {
        CheckUser(pass, data[0].pass, function (data) {
            if (data)
            {
                console.log("user authenticated, token generation in progress..");
                var token = TokenGenerator.generate();
                db.InsertInto("security", ["user", "token", "ip", "valid"], [1, token, ip, "STR_TO_DATE(valid+)"], function (data) {
                    console.log(data);
                    callback(true, token);
                });
            }
            else
            {
                console.log("error while authenticating user, token generation failed..");
                callback(false, "");
            }
        });
    })
};

var CheckUser = function (pass, hash, callback) {
    callback(bcrypt.compareSync(pass, hash));
};

exports.Tokenize = Tokenize;
exports.CreateUser = CreateUser;