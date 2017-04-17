var express = require('express')
var app = express();

var requestIp = require('request-ip');

// inside middleware handler
var ipMiddleware = function(req, res, next) {
    var clientIp = requestIp.getClientIp(req); // on localhost > 127.0.0.1
    console.log(clientIp);
    next();
};

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    /*console.log(req);*/
    next();
});


var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(function(req, res, next) {
    console.log("request");
    ipMiddleware(req,res,next);
});

app.get('/', function (req, res) {
    res.json({"status": "ok"});
});

app.post('/check',function(req,res) {
    var token = req.body.token;
    require(appRoot+"/modules/database.js").GetDbEngine(function (db) {
        db.SelectFrom("tbToken", "*", null, "where token='"+token+"'", function (data) {
            console.log(data);
            if(data.length != 0)
            {
                res.json({"valid": true, "token": token});
            }
            else
            {
                res.json({"valid": false, "token": token});
            }
        });
    });

});

app.post('/auth',function(req,res){
    var username	=	req.body.user;
    var pass	    =	req.body.pass;
    var id          =   req.body.id;

    if (username != undefined && pass != undefined && username != null && pass != null && id != undefined && id != null)
    {
        console.log("Request web for auth");
        console.log(username + " on device: " + id);
        require(appRoot + "/modules/database.js").GetDbEngine(function (db) {
            db.SelectFrom("tbUzivatel", "*", null, "where name='"+username+"'", function (data) {
                console.log(data);
                var user_id = data[0].id;
                console.log("USer id: " + user_id);
                require(appRoot+"/modules/api/security.js").CheckHashForUser(pass, data[0].pass, function (check) {
                    if (check)
                    {
                        console.log("sedí");
                        var expiry = new Date();
                        expiry.setDate(expiry.getDate() + 30);
                        require(appRoot+"/modules/api/security.js").GenerateTokenFromID(id, Date.parse(expiry), function (data) {
                            require(appRoot + "/modules/database.js").GetDbEngine(function (db) {
                                db.InsertInto("tbToken", ["token", "user_id", "expiration"], [data+"", user_id, expiry+""], function (result) {
                                    res.json({
                                        "error": false,
                                        "token": data,
                                        "expire": expiry,
                                        "issued_for": id,
                                        "issued_by": require(appRoot + "/config.json").server_id
                                    });
                                    console.log(result);
                                });
                            });
                        });
                    }
                    else
                    {
                        console.log("nesedí");
                        res.json({"error": true, "token": "invalid data in request"});
                    }
                });
            });
        });
    }
    else
    {
        console.log("Invalid request for web auth");
        res.json({"error": true, "token": "invalid post request"});
    }
});

app.listen(3000, function () {
    console.log('rest api is running at localhost:3000!')
});