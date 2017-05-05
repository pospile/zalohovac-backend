var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(2579);
console.log("Socket api is running on 2579");

var db = require(appRoot + "/modules/database.js");


global.clients = [];


io.on('connection', function (socket) {

    clients.push(socket);

    console.log("Klient " + socket.id + " pripojen");
    socket.emit('init', { reset: socket.id });

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
                    var request = data;
                    console.log("Jedná se o zařízení z jiné platformy...");
                    console.log("Mac adresa nahrazena jedinečným id zařízení, žádá si zvýšenou pozornost admina!!!");
                    var mac = data.device;

                    db.DeviceExists(mac, function (exits) {
                        if (exits)
                        {
                            console.log("zařízení existuje, hledám token")
                            db.GetDbEngine(function (db) {
                                db.SelectFrom ("tbDevice", "*", null, "where mac_adress = '" + mac + "'", function (data) {
                                    var device = data;
                                    console.log("zarizeni a jeho id:");
                                    console.log("---------------------");
                                    console.log(data);
                                    console.log("---------------------");
                                    db.SelectFrom ("tbToken", "*", null, "where device_id = '" + data[0].id + "'", function (data) {
                                    console.log("ID zařízení adresa nalezena.");
                                    console.log("request data:---------");
                                    console.log(request);
                                    console.log(device[0]);
                                    console.log("request data:---------");
                                    if (request.reset == device[0].first_socket_id)
                                    {
                                        console.log("Součástí požadavku je reset token.");
                                        socket.emit("auth", {"error": true, "init": false, "token": data[0].token, "device": mac, "platform": "android", "desc": "token cannot be send if no first session id is provided (security reason)"});
                                    }
                                    else
                                    {
                                        console.log("Součástí požadavku není reset token.");
                                        socket.emit("auth", {"error": true, "init": false, "desc": "token access denied", "device": mac, "platform": "android"});
                                    }
                                    console.log("data odeslana");
                                    });
                                });
                            });

                        }
                        else
                        {
                            console.log("Mac adresa nenalezena!");
                            db.CreateNewDeviceByMac(mac, socket.id, "android", function (data) {
                                console.log(data);
                                console.log("Provádím select na vytvořené id");
                                db.GetDbEngine(function (db) {
                                    var updated = data.insertId;
                                    db.SelectFrom ("tbDevice", "*", null, "where id = '" + data.insertId + "'", function (data) {
                                        console.log("Dotaz na id zařízení dokončen.");
                                        console.log(data);
                                        require(appRoot+"/modules/api/security.js").CreateToken(data[0].id, data[0].mac_adress, data[0].first_socket_id, function (token) {
                                            console.log("Vygenerovali jsme token");
                                            console.log(token);
                                            socket.emit("auth", {"error": false, "init": true, "token": token, "device": mac, "platform": "android"});
                                            db.InsertInto("tbToken", ["token", "device_id"], [token, updated], function (data) {
                                                console.log("token saved");
                                            });
                                        });
                                    });
                                });
                            });
                        }
                    });

                }
                else
                {
                    console.log('invalid device identifier (mac adress)');
                    socket.emit("auth", {"error": true, "desc": "Invalid mac adress"});
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

    socket.on('disconnect', function () {

        console.log("Client #" + socket.id + " disconnected");
        for (var i = 0; i < clients.length; i++)
        {
            console.log(clients[i].id);
            if (socket.id == clients[i].id)
            {
                clients.splice(i, 1);
                console.log("Disconnection potvrzen");
            }
        }

    });


});
