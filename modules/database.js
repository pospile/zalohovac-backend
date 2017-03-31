var database = require(appRoot + "/modules/dbs/" + require(appRoot + "/config.json").db_engine);

console.log("database engine loaded");

var load_device_by_mac = function (mac, callback) {
    database.SelectFrom ("tbZarizeni", "*", null, "where mac_adress = '" + mac + "'", function (data) {
        console.log("Dotaz na mac adresu dokončen.");
        //console.log(data);
        callback(data);
    });
};


var create_new_device_from_mac = function (mac, callback) {
    database.InsertInto("tbZarizeni", ["mac_adress", "enabled", "last_online"], [mac, 0, new Date().toISOString().slice(0, 19).replace('T', ' ')], function (data) {
        console.log(data);
    });
};

exports.LoadDeviceByMac = load_device_by_mac;
exports.CreateNewDeviceByMac = create_new_device_from_mac;