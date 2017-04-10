var express = require('express')
var app = express();

var requestIp = require('request-ip');

// inside middleware handler
var ipMiddleware = function(req, res, next) {
    var clientIp = requestIp.getClientIp(req); // on localhost > 127.0.0.1
    console.log(clientIp);
    next();
};

app.use(function(req, res, next) {
    console.log("request");
    ipMiddleware(req,res,next);
});

app.get('/', function (req, res) {
    res.json({"status": "ok"});
});

app.post('/token', function (req, res) {
    res.json({"status": "ok"});
});

app.listen(3000, function () {
    console.log('rest api is running at localhost:3000!')
});