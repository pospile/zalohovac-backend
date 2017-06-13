var name = "";
var pass = "";

var path = require('path');
global.appRoot = path.resolve(__dirname);

process.argv.forEach(function (val, index, array) {
  if (index == 2) name = val;
  if (index == 3) pass = val;
});

console.log("Creating new user for administration");
require("./modules/api/security.js").CreateNewUser(name, pass);
console.log("User created successfully");