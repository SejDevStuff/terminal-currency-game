var tools = require('../tools')
var fs = require('fs');
const decache = require('decache');

const getFirstWord = string => {
    const firstWord = [];
    for (let i = 0; i < string.length; i += 1) {
        if (string[i] === ' ') break;
        firstWord.push(string[i]);
    }
    return firstWord.join('');
};

async function parseCommand(command, showDebug) {
    if (showDebug) {
        tools.log("Parser recieved '"+ command +"'");
    }
    var cleanCommand = command.replace(/[.,\"\'\/£#!$%\^&\*;:{}=\\_`~()]/g,"").trim();;
    if (cleanCommand == "") {
        return;
    }
    var commandName = getFirstWord(cleanCommand);
    var args = command.replace(commandName + " ", "").trim();

    if (cleanCommand.startsWith("gm ")) {
        var multiplayerCache = tools.getMultiplayerCache();
        if (multiplayerCache == true && fs.existsSync(process.cwd()+"/.tmp/currentServerSession.json")) {
            var serverMan = require('./ServerManager');
            var css = JSON.parse(fs.readFileSync(process.cwd()+"/.tmp/currentServerSession.json"));
            var ping = await serverMan.request(css.ip+"/ping");
            if (ping !== "Pong! TerminalEconomy") {
                console.log("Could not connect to server, is it down?");
                return;
            }
            const buff = Buffer.from(cleanCommand, 'utf-8');
            const base64 = buff.toString('base64');
            var res = JSON.parse(await serverMan.request(css.ip+"/runCommand?username="+css.username+"&password="+css.password+"&command="+base64+"&version="+tools.returnVersionString()))
            if (res.responseType !== "serverResponse") {
                console.log("The response recieved is not from a valid TerminalEconomy server");
                return;
            }
            console.log(res.userMessage);
            return;
        } else {
            console.log("Playing local game");
            return;
        }
    }

    if (!fs.existsSync(process.cwd() + '/game/cmd/'+ commandName +'.js')) {
        console.log("\x1b[1m\x1b[31m%s\x1b[0m", "Unknown command ('"+ commandName + "')!");
        return;
    }
    try {
        var commandNeeded = require('./cmd/'+ commandName +'.js');
        await commandNeeded.main(args);
        if (showDebug) {console.log("Flushing module cache...");}
        decache('./cmd/'+ commandName +'.js');
    } catch (e) {
        console.log("\x1b[1m\x1b[31m%s\x1b[0m", "An error occurred while running command '"+ command + "'.\n"+ e.message + "\n" + e.stack)
        if (showDebug) { tools.log(e.message) }
    }
    
}

module.exports = {
    parseCommand
}