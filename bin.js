console.log("Připravuji systém...");
console.log("Spouštím zálohovací server...");

console.log("Definuji pomocné proměnné");
var path = require('path');
global.appRoot = path.resolve(__dirname);
console.log("cesta " + appRoot + "/modules/dbs/" + require("./config.json").db_engine)
console.log("Spouštím dostupné api");

var db = require(appRoot+"/modules/database.js");


require('getmac').getMac(function(err,macAddress){
    if (err)  throw err
    console.log(macAddress)
    db.LoadDeviceByMac(macAddress, function (data) {
        console.log(data);
        if (data.length == 0)
        {
            console.log("Mac adresa nenalezena!");
            db.CreateNewDeviceByMac(macAddress, function (data) {
                console.log(data);
            });
        }
    });
});



require("./modules/router.js");
require("./modules/socket.js");