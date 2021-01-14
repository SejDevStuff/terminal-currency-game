/*
    JS Shell 
    (c) Copyright 2021 Sej

    File name: index.js
    File desc: Main body of shell
*/

var tools = require('./tools');
var configFile = tools.getConfigFile();
const fs = require('fs');
const parser = require('./game/parser');

if (configFile.SHOW_DEBUG_MESSAGES == true) {
    tools.log("Debug messages are set to TRUE.");
    var showDebug = true;
} else {
    tools.log("Debug messages are set to FALSE.");
    var showDebug = false;
}

if (configFile.CHECK_FOR_UPDATES == true) {
    console.log("Checking for updates...");
    tools.checkForUpdates();
}

if (configFile.USERNAME.trim() == "") {
    console.log("Please go to '"+ process.cwd() + "/config.json' and set a username!");
    process.exit();
}
console.log("\nHello, "+ configFile.USERNAME.trim() + "!")
if (showDebug) {
    tools.log("CONFIG_FILE=" + process.cwd() + "/config.json\nMAIN_SCRIPT=" + process.cwd() + "/index.js\nTOOLS_SCRIPT=" + process.cwd() + "/tools.js");
}

function _prompt() {
    var command = tools.input("> ");
    if (command.trim() == "") {
        return _prompt();
    }
    if (command.trim() == "exit" || command.trim() == "bye" || command.trim() == "stop" || command.trim() == "end") {
        console.log("Goodbye!");
        process.exit()
    }
    if (showDebug) {
        tools.log("Attempting to parse '"+ command.trim() + "'...");
    }
    parser.parseCommand(command.trim(), showDebug);
    if (showDebug) {
        tools.log("Parse successful, actions have been taken. Returning to prompt...");
    }
    return _prompt();
}

try {
    _prompt();
} catch (e) {
    if (fs.existsSync("./errors/")) {
        var debugFileLoc = process.cwd() + "/errors/" + tools.getDateTime() + ".debug";
    } else {
        fs.mkdirSync("./errors/");
        var debugFileLoc = process.cwd() + "/errors/" + tools.getDateTime() + ".debug";
    }
    fs.writeFileSync(debugFileLoc, "ERROR: " + e.message + "\nStack Trace:\n" + e.stack);
    tools.error("Something went wrong! Debug info saved at: " + debugFileLoc);
}
/*
var dir = "./." + tools.getAlphaNumericString() + "/";
fs.mkdirSync(dir);

var worldname = tools.input("Enter a world name to enter: ");

fs.rmdirSync(dir);
*/