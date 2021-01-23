try {
    var tools = require('./tools');
    var usermanagement = require('./UserManagement');
} catch (e) {
    console.log("A needed file could not be imported, server startup has halted abruptly.");
    return;
}
tools.runStartupChecks();
var configFile = tools.getConfigFile();
var LISTEN_PORT = configFile.LISTEN_PORT;
var ROOT_VIEW_MSG = configFile.ROOT_VIEW_MSG;
var MALFORMED_REQUEST_SHUTDOWN_THRESHOLD = configFile.MALFORMED_REQUEST_SHUTDOWN_THRESHOLD;
var malformed = 0;
const malformedReq = {
    status: "MALFORMED_REQUEST",
    responseType: "serverResponse"
}
tools.log("Starting ToolsEconomy server on port "+ LISTEN_PORT)

var express = require('express');
var app = express();

setInterval(function(){ 
    if (malformed == MALFORMED_REQUEST_SHUTDOWN_THRESHOLD) {
        console.log("\nMALFORMED_REQUEST_SHUTDOWN_THRESHOLD reached!\nShutting down server...");
        tools.runShutdownProcesses();
        console.log("Bye!")
        process.exit();
    }
}, 5000);


app.get('/runCommand', function (req, res) {
    try {
        var usernameProvided = req.query.username;
        var passwordProvided = req.query.password;
        var command = req.query.command;
        var clientVer = req.query.version;
        const buff = Buffer.from(command, 'base64');
        const cmdDecoded = buff.toString('utf-8');
        tools.logRequestRecieved("EXEC_COMMAND", cmdDecoded);
    } catch (e) {
        res.send(malformedReq)
        malformed++;
        console.log("Warning! A RUN_COMMAND malformed request was made, is it a possible server attack?")
    }
});

app.get('/authCheck', function (req, res) {
    try {
        var usernameProvided = req.query.username;
        var passwordProvided = req.query.password;
        tools.logRequestRecieved("AUTH_CHECK", usernameProvided);
        res.send(usermanagement.frontEndAuth(usernameProvided, passwordProvided));
    } catch (e) {
        res.send(malformedReq)
        malformed++;
        console.log("Warning! A AUTH_CHECK malformed request was made, is it a possible server attack?")
    }
});

app.get('/ping', function (req, res) {
    res.send("Pong! TerminalEconomy")
});


app.get('/getStats', function (req, res) {
    try {
        var usernameProvided = req.query.username;
        var passwordProvided = req.query.password;
        tools.logRequestRecieved("GET_STATS", usernameProvided);
        res.send(usermanagement.getStats(usernameProvided, passwordProvided));
    } catch (e) {
        res.send(malformedReq)
        malformed++;
        console.log("Warning! A GET_STATS malformed request was made, is it a possible server attack?")
    }
});

app.get('/existUser', function (req, res) {
    try {
        var usernameProvided = req.query.username;
        tools.logRequestRecieved("EXISTING_USER_CHECK", usernameProvided);
        res.send(usermanagement.existingUserCheck(usernameProvided));
    } catch (e) {
        res.send(malformedReq)
        malformed++;
        console.log("Warning! A EXISTING_USER_CHECK malformed request was made, is it a possible server attack?")
    }
    
});

app.get('/setupUser', function (req, res) {
    try {
        var usernameProvided = req.query.username;
        tools.logRequestRecieved("SETUP_USER", usernameProvided);
        res.send(usermanagement.setupUser(usernameProvided));
    } catch (e) {
        res.send(malformedReq)
        malformed++;
        console.log("Warning! A SETUP_USER malformed request was made, is it a possible server attack?")
    }

}); 

app.get('*', function (req, res) {
    res.send(ROOT_VIEW_MSG);
});

var server = app.listen(LISTEN_PORT, function () {
var port = server.address().port;

console.log('ToolsEconomy server running and listening at http://localhost:'+ port);

});