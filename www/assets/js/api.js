
alertify.parent($("#app"));

function GetToken() {
    return store.get("token");
}

function TokenExpireIn() {
    return moment(store.get("expire")).fromNow();
}

var CheckTokenValidity = function (callback) {

    //$("#app").hide();

    if (!store.get("check"))
    {
        store.set("check", 1);
    }

    var check = store.get("check");
    store.set("check", check+1);

    if (store.get("check") > 9)
    {
        console.log("Validate check for token");
        $.post( "http://localhost:3000/check", { token: store.get("token") })
            .done(function( data ) {
                if (data.valid)
                {
                    console.log("TOKEN VALID!!!");
                    store.set("check", 0);
                }
                else
                {
                    force_logout();
                }
            })
            .fail(function() {
                alert( "error, please try again" );
            });
    }
    if (store.get("check") == 5)
    {
        alertify.log("Your token expire " + TokenExpireIn());
    }
    else
    {
        console.log("No validation necessary");
    }

    var token = store.get('token');
    //console.log(token + " expiration: " + Date.parse(store.get("expire")) <= Date.parse(new Date()));
    if (token)
    {
        console.log("Token is present, check expiration now");
        console.log(moment(store.get("expire")));
        if(moment(store.get("expire")).isSameOrBefore(moment()))
        {
            alertify.error("Invalid token and||or token expiration");
            window.location.replace("./login.html?code=1");
        }
        else
        {
            console.log("User accepted, redirect not neccessary now.");
            //callback(true);
            //$("#app").show();
        }
    }
    else
    {
        console.log("Token isnt present");
        window.location.replace("./login.html?code=0");
    }

};

var SetNewTokenAndExpiration = function (id, token, expiration) {
    store.set("user", id);
    store.set("token", token);
    store.set("expire", expiration);
};

function guid() {
    if (store.get("id"))
    {
        return store.get("id");
    }
    else
    {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        var ret = s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        store.set("id", ret);
        return ret;
    }
}

var login = function (name, pass) {
    console.log("unique id:" + guid());
    var show_timeout = true;
    var time = setTimeout(function () {
        if(show_timeout){ alertify.error("Error while logging in, please wait for a while and try again."); }
    }, 3000);
    $.post( "http://localhost:3000/auth", { user: name, pass: pass, id: guid() })
        .done(function( data ) {
            clearTimeout(time);
            if (!data.error)
            {
                console.log(data);
                SetNewTokenAndExpiration(data.issued_for, data.token, Date.parse(data.expire));
                show_timeout = false;
                window.location.replace("./index.html");
            }
            else
            {
                alertify.error("Login invalid, please try again");
            }
        });
    alertify.log("Logging into Zalohovac, please wait.");
};


//SEND IMMIDIATE REQUEST TO DESTROY TOKEN
var force_logout = function () {
    store.remove("token");
    store.remove("expire");
    window.location.replace("./login.html?code=2");
};

var GetMessage = function (callback) {
    var params = {};

    if (location.search) {
        var parts = location.search.substring(1).split('&');

        for (var i = 0; i < parts.length; i++) {
            var nv = parts[i].split('=');
            if (!nv[0]) continue;
            params[nv[0]] = nv[1] || true;
        }
    }

    if (params.code == 0)
    {
        alertify.error("Token invalid, please log-in again.");
    }
    else if (params.code == 1)
    {
        alertify.error("Token expired, please relog again.");
    }
    else if (params.code == 2)
    {
        alertify.error("You were logouted.");
    }
    else
    {
        alertify.success("Please log-in to continue to Zalohovac");
    }
    callback(params.code);
};

var RenderDeviceTable = function () {
    $("#devices").html("");
    $.post( "http://localhost:3000/devices", {"id": store.get("user"), "token": store.get("token")})
        .done(function( data ) {
            console.log(data);
            if (data.length != 0)
            {
                console.log("valid data");
                for (var i = 0; i < data.length; i++)
                {
                    var html_row = '<tr><td data-title="ID">'+data[i].id+'</td><td data-title="mac">'+data[i].mac_adress+'</td><td data-title="last online">'+moment(data[i].last_online).format()+'</td><td data-title="platform">'+data[i].platform+'</td><td data-title="reset id">'+data[i].first_socket_id.substring(0,6)+"..."+'</td><td data-title="group">'+data[i].group+'</td><td data-title="enabled">'+data[i].enabled+'</td></tr>'
                    $("#devices").append(html_row);
                }
            }
        });
};

var RenderLocationsTable = function (hide) {
    if (hide) {$("#success").hide();}
    $("#locations").html("");
    $.post( "http://localhost:3000/locations", {"id": store.get("user"), "token": store.get("token")})
        .done(function( data ) {
            console.log(data);
            if (data.length != 0)
            {
                for (var i = 0; i < data.length; i++)
                {
                    var html_row = '<tr> <th scope="row">'+data[i].id+'</th> <td>'+data[i].name+'</td> <td>'+data[i].url+'</td> <td>'+data[i].login+'</td><td>(hidden)</td><td>'+data[i].enabled+'</td></tr>'
                    $("#locations").append(html_row);
                }
            }
        });
};

var NewLocation = function () {
    $.post( "http://localhost:3000/locations/new", {"id": store.get("user"), "token": store.get("token"), "name": $("#name").val(), "url": $("#url").val(), "user": $("#login").val(), "pass": $("#pass").val()})
        .done(function( data ) {
            $("#success").show();
            RenderLocationsTable();
        });
}