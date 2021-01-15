var tools = require('../tools')

function parseCommand(command, showDebug) {
    if (showDebug) {
        tools.log("Parser recieved '"+ command +"'");
    }
    try {
        var commandNeeded = require('./cmd/'+ command +'.js');
        commandNeeded.main();
    } catch (e) {
        console.log("\x1b[1m\x1b[31m%s\x1b[0m", "Unknown command ('"+ command + "')!")
        if (showDebug) { tools.log(e.message) }
    }
    
}

module.exports = {
    parseCommand
}