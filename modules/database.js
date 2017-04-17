var database = require(appRoot + "/modules/dbs/" + require(appRoot + "/config.json").db_engine);

console.log("database engine loaded");

var get_db_engine = function (callback) {
    callback(database);
};

var load_device_by_mac = function (mac, callback) {
    database.SelectFrom ("tbZarizeni", "*", null, "where mac_adress = '" + mac + "'", function (data) {
        console.log("Dotaz na mac adresu dokončen.");
        //console.log(data);
        callback(data);
    });
};

var device_exists = function (mac, callback) {
    load_device_by_mac(mac, function (data) {
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



var create_new_device_from_mac = function (mac, socket_id, platform, callback) {
    console.log("Zapisuji do databáze nové zařízení");
    database.InsertInto("tbZarizeni", ["mac_adress", "enabled", "last_online", "first_socket_id", "platform"], [mac, 0, new Date().toISOString().slice(0, 19).replace('T', ' '), socket_id, platform], function (data) {
        //console.log(data);
        callback(data);
        console.log("Zapisuji zařízení: " + data.insertId);
        database.InsertInto("tbDevicesGroups", ["device_id", "group_id"], [data.insertId,1], function (data) {
            console.log(data);
            console.log("Zařízení přidáno do defaultní skupiny");
        });
    });
};

exports.LoadDeviceByMac = load_device_by_mac;
exports.CreateNewDeviceByMac = create_new_device_from_mac;
exports.GetDbEngine = get_db_engine;
exports.DeviceExists = device_exists;