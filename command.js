var versiony = require('versiony');

var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);

var path = require('path');
global.appRoot = path.resolve(__dirname);
console.log("cesta: " + appRoot + "/package.json");

if (argv.v == true)
{
    console.log("System is succesfully managed as updated")

    versiony
        .patch()                //will cause the minor version to be bumped by 1
        .from(appRoot + '/package.json')   //read the version from version.json
        .to();
}
else
{
    console.log("System is not succesfully managed as updated");
}

