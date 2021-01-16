var tools = require('../tools')

const getFirstWord = string => {
    const firstWord = [];
    for (let i = 0; i < string.length; i += 1) {
        if (string[i] === ' ') break;
        firstWord.push(string[i]);
    }
    return firstWord.join('');
};

function parseCommand(command, showDebug) {
    if (showDebug) {
        tools.log("Parser recieved '"+ command +"'");
    }
    var commandName = getFirstWord(command);
    var args = command.replace(commandName + " ", "").trim();
    try {
        var commandNeeded = require('./cmd/'+ commandName +'.js');
        commandNeeded.main(args);
    } catch (e) {
        console.log("\x1b[1m\x1b[31m%s\x1b[0m", "Unknown command ('"+ command + "')!")
        if (showDebug) { tools.log(e.message) }
    }
    
}

module.exports = {
    parseCommand
}