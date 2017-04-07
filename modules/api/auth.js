var db = require(appRoot + "/modules/database.js");

var device_exists = function (mac, callback) {
    db.LoadDeviceByMac(mac, function (data) {
        console.log(data);
        if (data.length == 0)
        {
            callback(false);
        }
        else
        {
            callback(true);
        }
    });
};

var create_device = function (mac, session_id, callback) {

};

var auth_device = function (mac, token, callback) {
    if (mac != undefined || mac != "")
    {

    }
    else
    {
        callback({"done": false, "error": "token can not be null"});
    }
};

exports.DeviceExists = device_exists;