try {
    var tools = require('./tools');
    var usermanagement = require('./UserManagement');
    var mb = require('./MaliceBlocker');
} catch (e) {
    console.log("A needed file could not be imported, server startup has halted abruptly.");
    return;
}
tools.runStartupChecks();
var configFile = tools.getConfigFile();
var LISTEN_PORT = configFile.LISTEN_PORT;
var ROOT_VIEW_MSG = configFile.ROOT_VIEW_MSG;
const malformedReq = {
    status: "MALFORMED_REQUEST",
    responseType: "serverResponse"
}
tools.log("Starting ToolsEconomy server on port "+ LISTEN_PORT)

var express = require('express');
var app = express();


app.get('/runCommand', function (req, res) {
    try {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        mb.mbStore(ip);
        if (mb.mbIsBlocked(ip) == true) {
            res.end()
            return;
        }
        mb.mbReqInc(ip);
        var usernameProvided = req.query.username;
        var passwordProvided = req.query.password;
        var command = req.query.command;
        var clientVer = req.query.version;
        const buff = Buffer.from(command, 'base64');
        const cmdDecoded = buff.toString('utf-8');
        tools.logRequestRecieved("EXEC_COMMAND", cmdDecoded);
    } catch (e) {
        res.send(malformedReq)
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        mb.mbMalreqInc(ip);
        console.log("Warning! A RUN_COMMAND malformed request was made, is it a possible server attack?")
    }
});

app.get('/authCheck', function (req, res) {
    try {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        mb.mbStore(ip);
        if (mb.mbIsBlocked(ip) == true) {
            res.end()
            return;
        }
        mb.mbReqInc(ip);
        var usernameProvided = req.query.username;
        var passwordProvided = req.query.password;
        tools.logRequestRecieved("AUTH_CHECK", usernameProvided);
        res.send(usermanagement.frontEndAuth(usernameProvided, passwordProvided));
    } catch (e) {
        res.send(malformedReq)
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        mb.mbMalreqInc(ip);
        console.log("Warning! A AUTH_CHECK malformed request was made, is it a possible server attack?")
    }
});

app.get('/ping', function (req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    mb.mbStore(ip);
    if (mb.mbIsBlocked(ip) == true) {
        res.end()
        return;
    }
    mb.mbReqInc(ip);
    res.send("Pong! TerminalEconomy");
});


app.get('/getStats', function (req, res) {
    try {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        mb.mbStore(ip);
        if (mb.mbIsBlocked(ip) == true) {
            res.end()
            return;
        }
        mb.mbReqInc(ip);
        var usernameProvided = req.query.username;
        var passwordProvided = req.query.password;
        tools.logRequestRecieved("GET_STATS", usernameProvided);
        res.send(usermanagement.getStats(usernameProvided, passwordProvided));
    } catch (e) {
        res.send(malformedReq)
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        mb.mbMalreqInc(ip);
        console.log("Warning! A GET_STATS malformed request was made, is it a possible server attack?")
    }
});

app.get('/existUser', function (req, res) {
    try {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        mb.mbStore(ip);
        if (mb.mbIsBlocked(ip) == true) {
            res.end()
            return;
        }
        mb.mbReqInc(ip);
        var usernameProvided = req.query.username;
        tools.logRequestRecieved("EXISTING_USER_CHECK", usernameProvided);
        res.send(usermanagement.existingUserCheck(usernameProvided));
    } catch (e) {
        res.send(malformedReq)
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        mb.mbMalreqInc(ip);
        console.log("Warning! A EXISTING_USER_CHECK malformed request was made, is it a possible server attack?")
    }
    
});

app.get('/setupUser', function (req, res) {
    try {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        mb.mbStore(ip);
        if (mb.mbIsBlocked(ip) == true) {
            res.end()
            return;
        }
        mb.mbReqInc(ip);
        var usernameProvided = req.query.username;
        tools.logRequestRecieved("SETUP_USER", usernameProvided);
        res.send(usermanagement.setupUser(usernameProvided));
    } catch (e) {
        res.send(malformedReq)
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        mb.mbMalreqInc(ip);
        console.log("Warning! A SETUP_USER malformed request was made, is it a possible server attack?")
    }

}); 

app.get('*', function (req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    mb.mbStore(ip);
    if (mb.mbIsBlocked(ip) == true) {
        res.end()
        return;
    }
    mb.mbReqInc(ip);
    res.send(ROOT_VIEW_MSG);
});

var server = app.listen(LISTEN_PORT, function () {
var port = server.address().port;

console.log('ToolsEconomy server running and listening at http://localhost:'+ port);

});