# Malice Blocker

**What is MaliceBlocker?**<br />
MaliceBlocker is a script (/server/MaliceBlocker.js) which helps to protect servers from DDoS attacks.<br />
Usually DDoS attacks are attacks which constantly send request packets to a server in order to slow it down, MaliceBlocker's function is to detect this and block the IPs which constantly ping the server.

MaliceBlocker has a series of checks which it matches each request against. It has a folder called /mb_data/ where it stores all of its data.

MaliceBlocker tries to be as non-disk-intensive as possible, but there are times where it writes to the disk, these include every request made and every malicious request made.

**How does it block IPs?**<br />
MaliceBlocker creates a file in /mb_data/blocked/ with the IP that is blocked, the rest of the server will always check if the request IP exists in this directory and if so, it will ignore the request providing no console output or response. This will create an endless loading phase of the request and eventually it times out. The server does this because a) it wants to ignore this request completely without using up any resources or the point of blocking is defeated and b) if an attacker gets no response from the server, they may believe that their attack has affected the server where really nothing much happened and they were blocked.

**How do I unblock someone?**<br />
MaliceBlocker will NOT automatically unblock someone, to unblock someone, follow these steps:

- Get your IP (lets say its 12.34.56.78)<br />
- Remove all punctuation from the IP, this includes "." and "/" and ":" and any other non alphanumeric character, so for out IP its (12345678). Remember this new IP<br />
- Look for the file /mb_data/blocked/IPHERE.json where IPHERE is the IP without any punctuation.<br />
If you can't find it, that IP was not blocked.<br />
If you can, delete the file, the IP is now unblocked!