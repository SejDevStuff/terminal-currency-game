var tools = require(process.cwd() + "/tools");
var fs = require('fs');
const extract = require('extract-zip');

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}   

function safeUpdate() {
    try {
        var fileList = JSON.parse(fs.readFileSync(process.cwd() + "/.tmp/update_extract/filelist.json"));
    } catch (e) {
        console.log("FATAL ERR: This update package does not seem to have a filelist. Cannot continue.");
        return;
    }
    var entries = fileList.entries;
    var entriesBackedUp = 0;
    for (i = 0; i < entries; i++) {
        try {
            var fdir = fileList.entry[i].fileDirectory;
            var fname = fileList.entry[i].fileName;
            if (fs.existsSync(process.cwd()+fdir+fname)) {
                entriesBackedUp++;
                console.log("["+ entriesBackedUp + "/" + entries + "] Replacing '"+ fdir+fname+"'...");
                fs.copyFileSync(process.cwd() + "/.tmp/update_extract/" +fdir+fname, process.cwd()+fdir+fname);
            } else {
                entriesBackedUp++;
                console.log("["+ entriesBackedUp + "/" + entries + "] Creating new file '"+ fdir+fname+"'...");
                fs.copyFileSync(process.cwd() + "/.tmp/update_extract/" +fdir+fname, process.cwd()+fdir+fname);
            }
        } catch (e) {
            console.log("An error occurred during the update process. Aborting operation...\n\nDebug-ERRMSG:"+ e.message +"\nDebug-ERRSTACK:"+ e.stack + "\n\nPlease check "+ process.cwd() + "/.tmp/before_update_backup/ for backed up files.")
            return;
        }
    }
}

async function backup() {
    try {
        var fileList = JSON.parse(fs.readFileSync(process.cwd() + "/.tmp/update_extract/filelist.json"));
    } catch (e) {
        console.log("FATAL ERR: This update package does not seem to have a filelist. Cannot continue.");
        return;
    }
    var entries = fileList.entries;
    var entriesBackedUp = 0;
    for (i = 0; i < entries; i++) {
        try {
            var fdir = fileList.entry[i].fileDirectory;
            var fname = fileList.entry[i].fileName;
            if (fs.existsSync(process.cwd()+fdir+fname)) {
                entriesBackedUp++;
                console.log("["+ entriesBackedUp + "/" + entries + "] Backing up '"+ fdir+fname+"'...");
                tools.initDir(process.cwd() + "/.tmp/before_update_backup/" + fdir);
                fs.copyFileSync(process.cwd()+fdir+fname, process.cwd() + "/.tmp/before_update_backup/" + fdir+fname);
            } else {
                entriesBackedUp++;
                continue;
            }
            console.log("\x1b[1m\x1b[34m%s\x1b[0m", "Waiting for all operations to complete...")
            await sleep(3000);
            safeUpdate();
        } catch (e) {
            console.log("An error occurred during the backup process. Aborting operation...\n\nDebug-ERRMSG:"+ e.message +"\nDebug-ERRSTACK:"+ e.stack)
            return;
        }
    }
}

async function main(args) {
    console.log("Initialising...")
    tools.downloadVerFile();
    await sleep(3000);

    var body = fs.readFileSync(process.cwd() + "/.tmp/latest-verfile.json");
    var remoteVerFile = JSON.parse(body);

    console.log("\x1b[1m\x1b[37m%s\x1b[0m", "Update Version: " + remoteVerFile.latestVersion + "\nUpdate Title: "+ remoteVerFile.versionData.main + "\nUpdate desc: " + remoteVerFile.versionData.sub)

    function updatePrompt() {
        var updatePromptText = tools.input("Update? y or n: ").trim();
        if (updatePromptText.toUpperCase() == "Y") {
            console.log("Continuing...");
        }
        if (updatePromptText.toUpperCase() == "N") {
            console.log("Abort.");
            return false;
        }
        if (updatePromptText == "") {
            return updatePrompt();
        }
    }

    var returnStatement = updatePrompt();
    if (returnStatement == false) {
        return;
    }

    if (args !== "--skip-download") {
        await tools.downloadUpdateArchive();
        console.log("\x1b[1m\x1b[34m%s\x1b[0m", "Waiting for all operations to complete...")
        await sleep(3000);
    } else {
        console.log("\x1b[1m\x1b[33m%s\x1b[0m", "Download has been skipped");
    }
    await tools.initDir(process.cwd() + "/.tmp/update_extract");
    await tools.initDir(process.cwd() + "/.tmp/before_update_backup");
    try {
        await extract(process.cwd() + "/.tmp/update.zip", { dir: process.cwd() + "/.tmp/update_extract/" })
    } catch (e) {
        console.log("\x1b[1m\x1b[31m%s\x1b[0m", "Something went wrong while extracting 'update.zip', if you have your own valid 'update.zip',\nplace it in "+ process.cwd() + "/.tmp/update.zip and call update with the --skip-download flag")
        return;
    }
    await backup();
}

module.exports = {
    main
}