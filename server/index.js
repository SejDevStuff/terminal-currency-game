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

tools.log("Starting ToolsEconomy server on port "+ LISTEN_PORT)

var express = require('express');
var app = express();

app.get('/authCheck', function (req, res) {
    var usernameProvided = req.query.username;
    var passwordProvided = req.query.password;
    tools.logRequestRecieved("AUTH_CHECK", usernameProvided);
    res.send(usermanagement.frontEndAuth(usernameProvided, passwordProvided));
});

app.get('/getStats', function (req, res) {
    var usernameProvided = req.query.username;
    var passwordProvided = req.query.password;
    tools.logRequestRecieved("GET_STATS", usernameProvided);
    res.send(usermanagement.getStats(usernameProvided, passwordProvided));
});

app.get('/existUser', function (req, res) {
    var usernameProvided = req.query.username;
    tools.logRequestRecieved("EXISTING_USER_CHECK", usernameProvided);
    res.send(usermanagement.existingUserCheck(usernameProvided));
});

app.get('/setupUser', function (req, res) {
    var usernameProvided = req.query.username;
    tools.logRequestRecieved("SETUP_USER", usernameProvided);
    res.send(usermanagement.setupUser(usernameProvided));
}); 

app.get('*', function (req, res) {
    res.send(ROOT_VIEW_MSG);
});

var server = app.listen(LISTEN_PORT, function () {
var port = server.address().port;

console.log('ToolsEconomy server running and listening at http://localhost:'+ port);

});