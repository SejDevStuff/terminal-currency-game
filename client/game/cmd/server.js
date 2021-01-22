const fs = require('fs');
const tools = require(process.cwd() + "/tools");

async function main(args) {
    var multiplayer = tools.getMultiplayerCache();
    if (multiplayer == false) {
        console.log("Please enable multiplayer with 'mp e'");
        return;
    }
    if (args == "--list") {
        try {
            var serverlist = JSON.parse(fs.readFileSync(process.cwd() + "/.tmp/servers.json"));
        } catch (e) {
            console.log("You do not have any saved servers.");
            return;
        }
        var entries = serverlist.entries;
        console.log("Server List - Your saved servers:\n")
        for (i = 0; i < entries; i++) {
            var name = serverlist.entry[i].savedName;
            var ip = serverlist.entry[i].savedIP;
            console.log(name + " (IP: "+ ip + ")");
        }
        console.log("\nUse 'server --save' to save a server.");
        console.log("Use 'server --connect IP' to connect and play on a server!")
    }
    if (args == "--save") {
        var inputName_X = tools.input("What name would you like to save this server as? > ").trim();
        var inputIP = tools.input("What is the IP of the server? > ").trim();
        var inputName = inputName_X.replace(/[.,\"\'\/£#!$%\^&\*;:{}=\-_`~()]/g,"");
        if (!fs.existsSync(process.cwd() + "/.tmp/servers.json")) {
            const cache = {
                entries: 1,
                entry: {
                    0:{
                        savedName: inputName,
                        savedIP: inputIP
                    }
                }
            }
            fs.writeFileSync(process.cwd() + "/.tmp/servers.json", JSON.stringify(cache))
            console.log("Saved server: "+ inputName);
        } else {
            var filed = JSON.parse(fs.readFileSync(process.cwd()+"/.tmp/servers.json"));
            const result = { ...filed };
            result.entries = (filed['entries'] + 1) || 1;
            const serverDet = {
                savedName: inputName,
                savedIP: inputIP
            }
            result.hasOwnProperty(filed.entries) ? result.entry[filed.entries + 1] = serverDet: result.entry[filed.entries] = serverDet;
            fs.writeFileSync(process.cwd() + "/.tmp/servers.json", JSON.stringify(result));
            console.log("Saved server: "+ inputName);
        }
    }
    if (args.startsWith("--connect")) {
        var ip = args.replace("--connect", "").trim();
        if (ip === undefined || ip === null || ip == "") {
            console.log("Please provide an IP! Syntax: 'server --connect IPHERE'");
            return;
        }
        var safeIP = ip.replace(/[\/\\]/g, "");
        var serverMan = require(process.cwd() + "/game/ServerManager.js");
        if (!fs.existsSync(process.cwd() + "/.tmp/serverCache/")) { fs.mkdirSync(process.cwd() + "/.tmp/serverCache/") }
        if (fs.existsSync(process.cwd() + "/.tmp/serverCache/"+safeIP+".json")) {
            var sC = JSON.parse(fs.readFileSync(process.cwd() + "/.tmp/serverCache/"+safeIP+".json"));
            var response = JSON.parse(await serverMan.request(ip+"/authCheck?username="+ sC.username + "&password=" + sC.password));
            if (!response.responseType == "serverResponse") {
                console.log("Could not ping server :/");
                return;
            } else {
                if (response.status == "AUTH_SUCCESS") {
                    console.log("Connected to server! ("+ip+")");
                    const connectionData = {
                        ip: ip
                    };
                    fs.writeFileSync(process.cwd()+"/.tmp/currentServerSession.json", JSON.stringify(connectionData))
                } else {
                    console.log("Something went wrong while connecting to server!");
                }
            }
        } else {
            console.log("Setting you up as a new user...");
            var config = tools.getConfigFile();
            var username = config.USERNAME;
            var existsUserURL = ip+"/existUser?username="+username;
            var createUserURL = ip+"/setupUser?username="+username;
            var existsUserRES = JSON.parse(await serverMan.request(existsUserURL));
            if (!existsUserRES.responseType == "serverResponse") {
                console.log("Could not ping server :/");
                return;
            }
            if (existsUserRES.status == "USER_EXISTS") {
                console.log("Someone with your username is already registered to this server, please change it before reconnecting.");
                return;
            }
            console.log("Creating your user...");
            var createUserRES = JSON.parse(await serverMan.request(createUserURL));
            if (!createUserRES.responseType == "serverResponse") {
                console.log("Could not ping server :/");
                return;
            }
            if (createUserRES.status == "USER_CREATION_SUCCESSFUL") {
                var pswProvided = createUserRES.password;
                const userCacheData = {
                    ip: ip,
                    pass: pswProvided
                };
                fs.writeFileSync(process.cwd() + "/.tmp/serverCache/"+safeIP+".json", JSON.stringify(userCacheData));
                console.log("User Set Up! Reconnect to test if it works.");
            } else {
                console.log("Something went wrong while creating a user!");
            }
            return;
        }
    }
}

module.exports = {
    main
}