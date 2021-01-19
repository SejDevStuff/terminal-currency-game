/*
    Terminal Economy
    (c) Copyright 2021 Sej

    File name: tools.js
    File desc: Tools for the game
*/
const prompt = require('prompt-sync')();
const fs = require('fs');
const { config } = require('process');
const fetch = require('node-fetch')
const programVersionString = "1.0.0";
const chalk = require('chalk');


function _raiseFatalError(errorName, errorType, errorDesc) {
    console.log(chalk.bgRedBright('=== FATAL GAME ERROR! ===')); 
    console.log("ErrorType: "+ errorType + "\nErrorName: "+ errorName + "\nErrorDesc: "+ errorDesc);
    console.log(chalk.redBright(chalk.italic("The program will now exit.")))
    process.exit();
}

const filearray = ["/index.js", "/tools.js", "/game/", "/game/parser.js", "/config.json"];

function runStartupProcesses(debug) {
    if (debug) {
        log("Running startup checks...");
    }
    var failed = 0;
    for (var i=0; i < filearray.length; i++) {
        if (fs.existsSync(process.cwd() + filearray[i])) {
            if (debug) {
                log("File exists: '"+ filearray[i] + "'");
            }
        } else {
            failed++;
            console.log("\nCritical File DOES NOT exist: '"+ filearray[i] + "'");
        }
    }
    return failed;
}

function runShutdownProcesses(debug) {
    if (debug) {
        log("Shutdown command recieved!");
    }
    if (fs.existsSync(process.cwd() + "/.tmp/multiplayerCache.json")) {
        //fs.rmdirSync(process.cwd() + "/.tmp/", { recursive: true });
        fs.rmSync(process.cwd() + "/.tmp/multiplayerCache.json");
    }
}

function returnVersionString() {
    return programVersionString;
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

function input(inputMsg) {
    const userEnteredInput = prompt(inputMsg);
    return userEnteredInput;
}

function getConfigFile() {
    var configRaw = fs.readFileSync('./config.json');
    return JSON.parse(configRaw);
}

function getAlphaNumericString() {
    return Math.random().toString(36).substr(2);
}

function getDateTime() {
    let currentDate = new Date();
    let cDay = currentDate.getDate();
    let cMonth = currentDate.getMonth() + 1;
    let cYear = currentDate.getFullYear();
    var date = cDay + "-" + cMonth + "-" + cYear;
    var today = new Date();
    var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
    return date + "_" + time;
}

function initDir(dirName) {
    if (fs.existsSync(dirName)) {
        // ok
    } else {
        fs.mkdirSync(dirName);
    }
}

function tmpInit() {
    if (fs.existsSync("./.tmp/")) {
        // ok
    } else {
        fs.mkdirSync("./.tmp/");
    }
}

async function downloadVerFile() {
    tmpInit();
    var verfileURL = "https://raw.githubusercontent.com/SejDevStuff/terminal-currency-game/main/verfile.json";
    await fetch(verfileURL)
    .then(res => res.text())
    .then(text => {fs.writeFileSync("./.tmp/latest-verfile.json", text)})
}

async function downloadUpdateArchive() {
    tmpInit();
    var http = require('https');
    var fs = require('fs');

    var download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
        file.close(cb);
        });
    });
    }
    download("https://raw.githubusercontent.com/SejDevStuff/terminal-currency-game/main/update.zip", process.cwd() + "/.tmp/update.zip", console.log("Downloaded Latest Update Pack"))
}

async function enableMultiplayer() {
    tmpInit();
    const multiplayerCache = {
        multiplayerEnabled: true
    };
    fs.writeFileSync("./.tmp/multiplayerCache.json", JSON.stringify(multiplayerCache));
}

async function disableMultiplayer() {
    tmpInit();
    const multiplayerCache = {
        multiplayerEnabled: false
    };
    fs.writeFileSync("./.tmp/multiplayerCache.json", JSON.stringify(multiplayerCache));
}

module.exports = {
    log,
    input,
    getConfigFile,
    error,
    getAlphaNumericString,
    getDateTime,
    downloadVerFile,
    disableMultiplayer,
    enableMultiplayer,
    returnVersionString,
    runShutdownProcesses,
    downloadUpdateArchive,
    downloadVerFile,
    initDir,
    tmpInit,
    runStartupProcesses,
    _raiseFatalError
}