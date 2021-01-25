/*
    Mainly (tries to) protect against DDoS by blocking IPs that repeatedly
    ping the server.

    Tries to be as non-disk-intensive as possible and only writes to the disk for:
        - Every new IP connected
        - Every malformed request
        - Every request in quick succession
*/

const fs = require('fs');

function mbInit() {
    if (!fs.existsSync("./mb_data/")) {
        fs.mkdirSync("./mb_data/");
    }
}

function mblog(log) {
    console.log("[MaliceBlocker] "+ log);
}

function mbReset() {
    mblog("Resetting MB data...");
    fs.rmdirSync("./mb_data/", { 
        recursive: true, 
    }); 
}

function mbStore(ip) {
    mbInit();
    var safeIP = ip.replace(/[.,\"\'\/£#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
    if (fs.existsSync("./mb_data/"+safeIP+".mbEntry")) {
        mblog(`This IP (${ip}) was already registered on MB`);
    } else {
        var mbOffenceData = {
            ip: ip,
            lastReq: 0,
            maliciousReqs: 0,
            reqs: 0
        };
        fs.writeFileSync("./mb_data/"+safeIP+".mbEntry", JSON.stringify(mbOffenceData))
        mblog(`Registered new IP (${ip}) on MB`);
    }
}

function mbMalreqInc(ip) {
    mbStore(ip);
    var safeIP = ip.replace(/[.,\"\'\/£#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
    var mbOffenceData = JSON.parse(fs.readFileSync("./mb_data/"+safeIP+".mbEntry", 'utf-8'));
    var malReqNew = eval(Number(mbOffenceData.maliciousReqs) + 1);
    var newOffenceData = {
        ip: mbOffenceData.ip,
        lastReq: mbOffenceData.lastReq,
        maliciousReqs: malReqNew,
        reqs: mbOffenceData.reqs
    }
    fs.writeFileSync("./mb_data/"+safeIP+".mbEntry", JSON.stringify(newOffenceData))
}

module.exports = {
    mbStore,
    mbMalreqInc
}