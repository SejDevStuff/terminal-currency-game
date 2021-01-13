/*
    JS Shell 
    (c) Copyright 2021 Sej

    File name: tools.js
    File desc: Tools for the shell
*/
const prompt = require('prompt-sync')();
const fs = require('fs');
const { config } = require('process');

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
    console.log("\n[ERROR] Called by "+ callerFile +" at "+ time + "\n"+msg);
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

module.exports = {
    log,
    input,
    getConfigFile,
    error,
    getAlphaNumericString,
    getDateTime
}