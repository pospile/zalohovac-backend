var bcrypt = require('bcryptjs');

var TokenGenerator = require( 'token-generator' )({
    salt: require(appRoot + "/config.json").salt,
    timestampMap: 'abcdefghij', // 10 chars array for obfuscation proposes
});


//CREATE NEW SECURED TOKEN FOR DEVICE
var CreateDeviceToken = function (id, mac, session_id, callback) {
    //vytvor token podle zadane mac adresy (identifikatoru)
    //var salt = bcrypt.genSaltSync(10);

    console.log("generuji token z: mac-" + mac + " session: " + session_id);

    var hash = bcrypt.hashSync(mac, bcrypt.genSaltSync(10));

    console.log("Zgenerovaný hash:" + hash);

    if (bcrypt.compareSync(mac, hash))
    {
        console.log("mac hashed as: " + hash);
    }
    callback(hash);
};

//CHECK IF DEVICE TOKEN IS VALID AND SERVER CAN COMMUNICATE WITH DEVICE
var CheckDeviceToken = function (id, mac, token) {
    //zkontroluj token pro daný device

};

//IN CASE OF SECURTIY LEAK, DISABLE TOKEN IMMIDIATELY
var DisableActiveToken = function () {

};


var CreateNewDevice = function () {

};

var AllowDevice = function () {

};

var DisableDevice = function () {

};

/*
 Create user in database (at least customer account should already exists)
 name            = name of user in database
 pass            = password chosen by user (none hashed)
 */
var CreateUser = function (name, pass)
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

        sql += ") ";
        values += ");"
        console.log("query: " + sql + values);
        db.InsertInto("tbUzivatel", ["name", "pass", "token"], [name, hash, 0], function (data) {
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

exports.CreateToken = CreateDeviceToken;