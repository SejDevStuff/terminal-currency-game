# Terminal game commands
These commands are stored by no specific order.
---
### server
The server command allows you to connect to multiplayer servers and play on them!
To list your saved servers, do ``server --list``, to save an IP, do ``server --save`` and to connect to a server, do ``server --connect <IP>``
**Errors during execution:** None reported so far

### update
Update automatically downloads the latest update archive and then backs up all files that it will change, when this is successful it proceeds to replace files with newer versions and create new files if necessary.
Optional arguments: "--skip-download" will skip the download if you have your own update.zip file.
NOTICE: update.zip is not an ordinary file and it requires a properly configured file-list else the update will fail or corrupt your installation, unless you are a pro, refrain using the "--skip-download" argument.

### mp
mp is short for "multiplayer", it tweaks the multiplayer options.
If you do "mp e" it will enable multiplayer and if you do "mp d" it will disable it

**Errors during execution:**
"mp e" will fail if you have an outdated version of the game. This is to prevent exploits found in older versions which may be fixed from being used. Yes, you can edit the file in ``<GAME_DIRECTORY>/.tmp/multiplayerCache.json`` but there are protections from the server itself which blocks outdated clients, a server owner may tweak these permissions to essentially create a "cracked" server.

### help
This command gives you the link which will lead you to this document.

**Errors during execution:**
There are not any known errors which seem to occur during execution.
