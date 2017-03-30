console.log("Připravuji systém...");
console.log("Spouštím zálohovací server...");

console.log("Definuji pomocné proměnné");
var path = require('path');
global.appRoot = path.resolve(__dirname);
console.log("Spouštím dostupné api");

require("./modules/router.js");
require("./modules/socket.js");