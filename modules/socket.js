var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(2579);
console.log("Socket api is running on 2579");

io.on('connection', function (socket) {
  console.log("Klient " + socket.id + " pripojen");
  socket.emit('init', { token: socket.id });
  
  socket.on('auth', function (data) {
    console.log(data);
  });
  
});
      