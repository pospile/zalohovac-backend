var database = require(appRoot + "/modules/dbs/" + require(appRoot + "/config.json").db_engine);

console.log("database engine loaded");

var loadDeviceByMac = function (mac, callback) {
    database.select_from ("tbZarizeni", "*", null, "mac_adress = " + mac, function (data) {
        console.log("Dotaz na mac adresu dokončen.");
        console.log(data);
        callback(data);
    });
};
