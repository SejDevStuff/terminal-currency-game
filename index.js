/*
    Terminal Economy
    (c) Copyright 2021 Sej

    File name: index.js
    File desc: Main body of game
*/
var tools = require('./tools');
var configFile = tools.getConfigFile();
const fs = require('fs');
const parser = require('./game/parser');
const programVersionString = "1.0.0";
if (configFile.SHOW_DEBUG_MESSAGES == true) {
    tools.log("Debug messages are set to TRUE.");
    var showDebug = true;
} else {
    tools.log("Debug messages are set to FALSE.");
    var showDebug = false;
}
if (configFile.START_WITH_MULTIPLAYER == true) {
    console.log("Enabling multiplayer...");
    tools.enableMultiplayer();
} else {
    tools.disableMultiplayer();
}
async function init() {
    try {
        if (configFile.CHECK_FOR_UPDATES == true) {
            console.log("Checking for updates...");
            var debugMessagesStatus = showDebug;
            if (debugMessagesStatus) {
                tools.log("Download version file...")
            }
            await tools.downloadVerFile();
            var body = fs.readFileSync("./.tmp/latest-verfile.json");
            var remoteVerFile = JSON.parse(body);
            if (debugMessagesStatus) { tools.log("Download seems to be successful, loading JSON file..."); }
            if (debugMessagesStatus) { tools.log("Local:" + programVersionString + ", remote:" + remoteVerFile.latestVersion)}
            if (remoteVerFile.latestVersion == programVersionString) {
                console.log("\x1b[1m\x1b[32m%s\x1b[0m", "Program is up to date!");
            } else {
                console.log('\x1b[1m\x1b[41m\x1b[33m%s\x1b[0m', "Program is out of date! Update as soon as you can with the 'update' command\nLatest Version: " + remoteVerFile.latestVersion + ", Your Version: " + programVersionString.trim())
                if (configFile.START_WITH_MULTIPLAYER == true) {
                    console.log("Cannot start with multiplayer, your version is incompatible. Going into singleplayer mode...");
                    tools.disableMultiplayer();
                }
            }
        } else {
            var updateNagChance = Math.floor(Math.random() * (5 - 1 + 1) + 1);
            if (updateNagChance < 2) {
                console.log("[!] You have disabled update checking. This can cause bugs which may be fixed to still exist\nIf you do not update, you may also be denied access to multiplayer.\nConsider changing it at "+ process.cwd() + "/config.json")
            }
        }
        mainBody();
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
}
function mainBody() {
    try {
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
}
init();