var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(2579);
console.log("Socket api is running on 2579");

var auth = require(appRoot + "/modules/api/auth.js");
var db = require(appRoot + "/modules/database.js");

io.on('connection', function (socket) {
    console.log("Klient " + socket.id + " pripojen");
    socket.emit('init', { token: socket.id });

    socket.on('auth', function (data) {
    console.log(data);

    if (data.mac != undefined || data.platform == "android")
    {
        var mac = data.mac;
        if ( require('getmac').isMac(mac) ) {
            console.log('valid mac');

            auth.DeviceExists(mac, function (exits) {
               if (exits)
               {
                   console.log("Mac adresa nalezena.");
                   socket.emit("auth", {"error": false, "init": false, "token": "", "mac": mac});
                   console.log("data odeslana");
               }
               else
               {
                   console.log("Mac adresa nenalezena!");
                   db.CreateNewDeviceByMac(mac, socket.id, "pc", function (data) {
                       console.log(data);
                       socket.emit("auth", {"error": false, "init": true, "token": "11223344", "mac": mac});
                   });
               }
            });

        }
        else {

            if (data.device != undefined)
            {
                console.log("Jedná se o zařízení z jiné platformy...");
                console.log("Mac adresa nahrazena jedinečným id zařízení, žádá si zvýšenou pozornost admina!!!");
                var mac = data.device;

                auth.DeviceExists(mac, function (exits) {
                    if (exits)
                    {
                        console.log("Mac adresa nalezena.");
                        socket.emit("auth", {"error": false, "init": false, "token": "", "device": mac, "platform": "android"});
                        console.log("data odeslana");
                    }
                    else
                    {
                        console.log("Mac adresa nenalezena!");
                        db.CreateNewDeviceByMac(mac, socket.id, "android", function (data) {
                            console.log(data);
                            console.log("Provádím select na vytvořené id");
                            db.GetDbEngine(function (db) {
                                db.SelectFrom ("tbZarizeni", "*", null, "where id = '" + data.insertId + "'", function (data) {
                                    console.log("Dotaz na id zařízení dokončen.");
                                    console.log(data);
                                    require(appRoot+"/modules/api/security.js").CreateToken(data[0].id, data[0].mac_adress, data[0].first_socket_id, function (token) {
                                        console.log("Vygenerovali jsme token");
                                        console.log(token);
                                        socket.emit("auth", {"error": false, "init": true, "token": token, "device": mac, "platform": "android"});
                                    });
                                });
                            });
                        });
                    }
                });

            }
            else
            {
                console.log('invalid mac');
                socket.emit("auth", {"error": true, "desc": "Invalid ip adress"});
            }

        }

    }
    });

    socket.on('zaloha-manual', function (data) {
        console.log(data);
        if (data.token != undefined) {

        }
    });

    socket.on('structure', function (data) {
        console.log(data);
        if (data.token != undefined) {
            console.log("Přijímám strukturu od klienta");
        }
    });

});
