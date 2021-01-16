const fs = require('fs');

function getMultiplayerCache() {
    var raw = fs.readFileSync(process.cwd() + "/.tmp/multiplayerCache.json");
    return JSON.parse(raw);
}

function main(args) {
    var tools = require(process.cwd() + '/tools');
    var fs = require('fs');

    if (args.trim() == "") {
        console.log("Needed argument: e [enable multiplayer] or d [disable multiplayer]\nDo 'mp e' or 'mp d'");
        return;
    }

    if (args == "e") {

        if (!fs.existsSync(process.cwd() + "/.tmp/latest-verfile.json")) {
            console.log("\x1b[1m\x1b[31m%s\x1b[0m", "Command failed, CHECK_FOR_UPDATES must be turned on in config.json")
            return;
        }

        var mpcache = getMultiplayerCache();
        if (mpcache.multiplayerEnabled == true) {
            console.log("Nothing changed, multipler is already enabled!");
            return;
        } 
        var remoteVerFileRaw = fs.readFileSync(process.cwd() + "/.tmp/latest-verfile.json");
        var remoteVersion = JSON.parse(remoteVerFileRaw).latestVersion;
        var localVersion = tools.returnVersionString();
        if (remoteVersion == localVersion) {
            tools.enableMultiplayer();
            console.log("Enabled Multiplayer!")
        } else {
            console.log("\x1b[1m\x1b[31m%s\x1b[0m", "Your client is outdated, so multiplayer is not possible.");
            tools.disableMultiplayer();
        }
    }
    if (args == "d") {
        var mpcache = getMultiplayerCache();
        if (mpcache.multiplayerEnabled == false) {
            console.log("Nothing changed, multipler is already disabled!");
            return;
        } 
        tools.disableMultiplayer();
        console.log("Disabled Multiplayer!");
    }
}

module.exports = {
    main
}