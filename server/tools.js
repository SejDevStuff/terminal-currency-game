var fs = require('fs');
const prompt = require('prompt-sync')();
function input(inputMsg) {
    const userEnteredInput = prompt(inputMsg);
    return userEnteredInput;
}

function runStartupChecks() {
    if (!fs.existsSync("./config.json")) {
        const configData = {
            LISTEN_PORT: 6162,
            ROOT_VIEW_MSG:"Hey, I am your ToolsEconomy server!"
        };
        fs.writeFileSync("./config.json", JSON.stringify(configData, null, "\t"))
    }
    if (!fs.existsSync("./users/")) {
        fs.mkdirSync("./users/");
    }
}

function logRequestRecieved(requestType, requestData) {
    if (requestData === undefined || requestData === null) {
        requestData = "Unknown"
    }
    if (requestType === undefined || requestType === null) {
        requestType = "Unknown"
    }
    console.log("[INFO] A new "+ requestType +" request was made! Containing data: '"+ requestData + "'");
}

function _getCallerFile() {
    try {
        var err = new Error();
        var callerfile;
        var currentfile;

        Error.prepareStackTrace = function (err, stack) { return stack; };

        currentfile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();

            if(currentfile !== callerfile) return callerfile;
        }
    } catch (err) {}
    return undefined;
}

function log(messageToLog) {
    var callerFile = _getCallerFile();
    var callerFile = callerFile.replace(process.cwd(), "")
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log("["+ time + "] "+ callerFile +": "+ messageToLog);
}

function error(msg) {
    var callerFile = _getCallerFile();
    var callerFile = callerFile.replace(process.cwd(), "")
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.error("\n[ERROR] Called by "+ callerFile +" at timeStamp "+ time); 
    console.log(msg);
}

function getConfigFile() {
    var configRaw = fs.readFileSync('./config.json');
    return JSON.parse(configRaw);
}

function runShutdownProcesses() {
    // none yet
}

module.exports = {
    logRequestRecieved,
    log,
    error,
    getConfigFile,
    runStartupChecks,
    input,
    runShutdownProcesses
}