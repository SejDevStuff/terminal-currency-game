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
    var cleanCommand_p1 = command.split('/').join('');
    var cleanCommand = cleanCommand_p1.split('.').join('');
    if (cleanCommand == "") {
        return;
    }
    var commandName = getFirstWord(cleanCommand);
    var args = command.replace(commandName + " ", "").trim();
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