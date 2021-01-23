var fs = require('fs');
const { log } = require('../client/tools');
var tools = require('./tools');

const sResponse = {
    status: "AUTH_SUCCESS",
    responseType: "serverResponse"
};
const fResponse = {
    status: "AUTH_FAILED",
    responseType: "serverResponse"
};

function authoriseUserRequest(username, passwordProvided) {
    if (!fs.existsSync("./users/"+username+"/auth.json")) { return false; }
    var authFile = JSON.parse(fs.readFileSync("./users/"+username+"/auth.json"));
    if (authFile.username == username && authFile.password == passwordProvided) { return true; } else { return false; }
}

function frontEndAuth(username, password) {
    var auth = authoriseUserRequest(username, password);
    if (auth == true) {
        return sResponse;
    } else {
        return fResponse;
    }
}

function getStats(username, passwordProvided) {
    var auth = authoriseUserRequest(username, passwordProvided);
    var Fresponse = {
        status: "AUTH_FAILED",
        responseType: "serverResponse"
    };
    if (auth == false) {
        return JSON.stringify(Fresponse);
    }
    if (!fs.existsSync("./users/"+username+"/stats.json")) { return JSON.stringify(Fresponse); }
    return JSON.parse(fs.readFileSync("./users/"+username+"/stats.json"));
}

function existingUserCheck(username) {
    if (fs.existsSync("./users/"+username+"/auth.json")) {
        const response = {
            status: "USER_EXISTS",
            responseType: "serverResponse"
        };
        return JSON.stringify(response);
    } else {
        const response = {
            status: "USER_DOES_NOT_EXIST",
            responseType: "serverResponse"
        };
        return JSON.stringify(response);
    }
}

function setupUser(username) {
    if (fs.existsSync("./users/"+username+"/auth.json")) {
        const response = {
            status: "USER_EXISTS"
        };
        return JSON.stringify(response);
    }
    var password = Math.random().toString(36).slice(2)
    const userAuth = {
        username: username,
        password: password
    };
    const userStats = {
        money_bank: 0,
        money_wallet: 0,
        idle_mode: false,
        bank_max: 1000,
        UCCP_VALUE: "_XVC-->GOOD_UCCP_VALUE_!"
    }
    fs.mkdirSync("./users/"+username+"/");
    fs.mkdirSync("./users/"+username+"/assets")
    fs.writeFileSync("./users/"+username+"/auth.json", JSON.stringify(userAuth));
    fs.writeFileSync("./users/"+username+"/stats.json", JSON.stringify(userStats));
    const response = {
        status: "USER_CREATION_SUCCESSFUL",
        password: password,
        responseType: "serverResponse"
    };
    return JSON.stringify(response);
}

module.exports = {
    existingUserCheck,
    setupUser,
    authoriseUserRequest,
    getStats,
    frontEndAuth
}