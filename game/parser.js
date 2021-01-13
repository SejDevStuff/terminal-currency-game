var tools = require('../tools')

function parseCommand(command, showDebug) {
    if (showDebug) {
        tools.log("Parser recieved '"+ command +"'");
    }
}

module.exports = {
    parseCommand
}