const fs = require('fs');
const tools = require(process.cwd() + "/tools");

function main(args) {
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
}

module.exports = {
    main
}