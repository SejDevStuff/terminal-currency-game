/*
    Mainly (tries to) protect against DDoS by blocking IPs that repeatedly
    ping the server.

    https://github.com/SejDevStuff/terminal-currency-game/blob/main/Docs/server/maliceblock.md
*/

const fs = require('fs');

function mbInit() {
    if (!fs.existsSync("./mbdata/")) {
        fs.mkdirSync("./mbdata/");
    }
    if (!fs.existsSync("./mbdata/blocked/")) {
        fs.mkdirSync("./mbdata/blocked/");
    }
}

function mblog(log) {
    console.log("[MaliceBlocker] "+ log);
}

function mbReset() {
    mblog("Resetting MB data...");
    fs.rmdirSync("./mbdata/", { 
        recursive: true, 
    }); 
}

function mbStore(ip) {
    mbInit();
    var safeIP = ip.replace(/[.,\"\'\/£#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
    if (fs.existsSync("./mbdata/"+safeIP+".mbEntry")) {
        //mblog(`This IP (${ip}) was already registered on MB`);
    } else {
        var mbOffenceData = {
            ip: ip,
            lastReq: 0,
            maliciousReqs: 0,
            lastMalReq: 0,
            reqs: 0
        };
        fs.writeFileSync("./mbdata/"+safeIP+".mbEntry", JSON.stringify(mbOffenceData))
        mblog(`Registered new IP (${ip}) on MB`);
    }
}

function mbBlockIp(ip, violation) {
    mbInit();
    var safeIP = ip.replace(/[.,\"\'\/£#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
    const block = {
        block: true
    };
    fs.writeFileSync("./mbdata/blocked/"+safeIP+".json", JSON.stringify(block));
    console.log("\x1b[1m\x1b[31m[MaliceBlocker] SEVERE:\x1b[0m\x1b[1m\x1b[33m BLOCKED IP "+ ip + ". " + violation + "\nUntil unblocked, the server will ignore any requests from this user\x1b[0m. ");
}

function mbIsBlocked(ip) {
    mbInit();
    var safeIP = ip.replace(/[.,\"\'\/£#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
    if (fs.existsSync("./mbdata/blocked/"+safeIP+".json")) {
        return true;
    } else {
        return false;
    }
}

function mbMalreqInc(ip) {
    mbInit();
    mbStore(ip);
    var safeIP = ip.replace(/[.,\"\'\/£#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
    var mbOffenceData = JSON.parse(fs.readFileSync("./mbdata/"+safeIP+".mbEntry", 'utf-8'));
    var malReqNew = eval(Number(mbOffenceData.maliciousReqs) + 1);
    var now = new Date();
    var time = now.getTime();
    var malReqTimeDif = eval(Number(time - mbOffenceData.lastMalReq));
    var newOffenceData = {
        ip: mbOffenceData.ip,
        lastReq: mbOffenceData.lastReq,
        maliciousReqs: malReqNew,
        lastMalReq: time,
        reqs: mbOffenceData.reqs
    }
    fs.writeFileSync("./mbdata/"+safeIP+".mbEntry", JSON.stringify(newOffenceData));
    var mbOffenceData = JSON.parse(fs.readFileSync("./mbdata/"+safeIP+".mbEntry", 'utf-8'));
    if (malReqTimeDif >= 3 && mbOffenceData.maliciousReqs >= 5) {
        mbBlockIp(ip, "Met or exceeded failing one or more limits for MB-MalReq");
        return;
    }
    if (mbOffenceData.maliciousReqs >= 10) {
        mbBlockIp(ip, "Met or exceeded failing one or more limits for MB-MalReq");
        return;
    }
}

function mbReqInc(ip) {
    mbInit();
    mbStore(ip);
    var safeIP = ip.replace(/[.,\"\'\/£#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
    var mbOffenceData = JSON.parse(fs.readFileSync("./mbdata/"+safeIP+".mbEntry", 'utf-8'));
    var malReqNew = eval(Number(mbOffenceData.reqs) + 1);
    var now = new Date();
    var time = now.getTime();
    var malReqTimeDif = eval(Number(time - mbOffenceData.lastReq));
    var newOffenceData = {
        ip: mbOffenceData.ip,
        lastReq: time,
        maliciousReqs: mbOffenceData.maliciousReqs,
        lastMalReq: mbOffenceData.lastMalReq,
        reqs: malReqNew
    }
    fs.writeFileSync("./mbdata/"+safeIP+".mbEntry", JSON.stringify(newOffenceData));
    var mbOffenceData = JSON.parse(fs.readFileSync("./mbdata/"+safeIP+".mbEntry", 'utf-8'));
    if (malReqTimeDif >= 5 && mbOffenceData.reqs >= 5) {
        mbBlockIp(ip, "Met or exceeded failing one or more limits for MB-Req");
        return;
    }
    if (mbOffenceData.reqs >= 10) {
        mbBlockIp(ip, "Met or exceeded failing one or more limits for MB-Req");
        return;
    }
}

module.exports = {
    mbStore,
    mbMalreqInc,
    mbReqInc,
    mbIsBlocked
}