# terminal-currency-game
Currency Game ran in the terminal or shell - Written in JS
---
### The .tmp/ directory
The game will automatically make a ``.tmp/`` directory if one does not exist, although the name is misleading ``.tmp/`` stores all of your game data such as your servers and if you are playing on singleplayer, your stats. Its a bit like the ``.minecraft/`` in the game Minecraft. Unless you want to reset your progress, I suggest you do not remove or edit the .tmp/ directory. The game will automatically remove un-needed temporarily files on a successful shutdown so there is no need for you to remove it.

### Need help?
Go here: https://github.com/SejDevStuff/terminal-currency-game/blob/main/commands.md

### WARNING!
DO NOT download this by cloning the repo, repo commits always tend to have some unfinished thing in them. Use the releases tab [handy link](https://github.com/SejDevStuff/terminal-currency-game/releases)

## Want to test it out?
Please wait until we pass the beta versions and go to v1.0.0, where a release will be made [here](https://github.com/SejDevStuff/terminal-currency-game/releases)

### How do servers work?
Each server will have its own authentication system, there is no central database where users authenticate. This has advantages, if we had a central authentication server and it went down - users cant play. But it also means since each server has its own authentication system, as long as they are not connecting to the same server, many users can have the same username.
In your ``.tmp/`` directory, the authentication details for a server is stored. BEWARNED! If you delete your .tmp/ directory and lose the authentication details, your stats and user on that server is lost forever!!
If a authentication profile for a server doesnt exist in your ``.tmp/`` directory, the game tries to create a user on that server using the username you provided in your ``config.json``. If that username is already registered, you would be required to change it. If user creation is successful, the server returns a unique alphanumeric password, from now on this is needed to access your stats and run commands as your user. The game stores this in a file in ``.tmp/serverCache/IP.json`` where IP is the server IP. Then the game tries to contact the server with the new username and password to make sure everything is working. If all is fine, good job! You have registered yourself to that server. 
To run commands on a server, make sure multiplayer mode is enabled and connect to the server using ``server --connect <IP>``. This will create a series of files which tell your game to redirect the commands to the server.
