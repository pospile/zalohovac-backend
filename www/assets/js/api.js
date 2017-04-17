function GetToken() {
    return store.get("token");
}

function TokenExpireIn() {
    return moment(store.get("expire")).fromNow();
}

var CheckTokenValidity = function (callback) {

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
        }
    }
    else
    {
        console.log("Token isnt present");
        window.location.replace("./login.html?code=0");
    }

};

var SetNewTokenAndExpiration = function (token, expiration) {
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
                SetNewTokenAndExpiration(data.token, Date.parse(data.expire));
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