var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var db = require(appRoot + "/modules/database.js");

server.listen(2579);
console.log("Socket api is running on 2579");


io.on('connection', function (socket) {
  console.log("Klient " + socket.id + " pripojen");
  socket.emit('init', { token: socket.id });

  socket.on('auth', function (data) {
    console.log(data);
    if (data.mac != undefined)
    {
        var mac = data.mac;
        if ( require('getmac').isMac(mac) ) {
            console.log('valid mac');
            db.LoadDeviceByMac(mac, function (data) {
                console.log(data);
                if (data.length == 0)
                {
                    console.log("Mac adresa nenalezena!");
                    db.CreateNewDeviceByMac(mac, function (data) {
                        console.log(data);
                        socket.emit("auth", {"error": false, "init": true, "token": "11223344", "mac": mac});
                    });
                }
                else
                {
                    console.log("Mac adresa nalezena.");
                    socket.emit("auth", {"error": false, "init": false, "token": "11223344", "mac": mac});
                    console.log("data odeslana");
                }

            });
        }
        else {
            console.log('invalid mac');
            socket.emit("auth", {"error": true, "desc": "Invalid ip adress"})
        }
    }
  });
});
