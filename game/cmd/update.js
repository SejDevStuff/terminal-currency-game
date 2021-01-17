var tools = require(process.cwd() + "/tools");
var fs = require('fs');
var unzip = require('node-unzip');

function backup() {
    try {
        var fileList = JSON.parse(fs.readFileSync(process.cwd() + "/.tmp/update_extract/filelist.json"));
    } catch (e) {
        console.log("FATAL ERR: This update package does not seem to have a filelist. Cannot continue.");
        return;
    }
    var entries = fileList.entries;
    for (i = 0; i < entries; i++) {
        try {
            var fdir = fileList.entry[i].fileDirectory;
            var fname = fileList.entry[i].fileName;
            if (fs.existsSync(process.cwd()+fdir+fname)) {
                tools.initDir(process.cwd() + "/.tmp/before_update_backup/" + fdir);
                fs.copyFileSync(process.cwd()+fdir+fname, process.cwd() + "/.tmp/before_update_backup/" + fdir);
            } else {
                continue;
            }
        } catch (e) {
            console.log("An error occurred during the backup process. Aborting operation...\n\nDebug-ERRMSG:"+ e.message +"\nDebug-ERRSTACK:"+ e.stack)
            return;
        }
    }
}

function main(args) {
    tools.downloadUpdateArchive();
    tools.initDir(process.cwd() + "/.tmp/update_extract");
    tools.initDir(process.cwd() + "/.tmp/before_update_backup");
    fs.createReadStream(process.cwd() + "/.tmp/update.zip").pipe(unzip.Extract({ path: process.cwd() + "/.tmp/update_extract/" }));
    backup();
}

module.exports = {
    main
}