# Malice Blocker

**What is MaliceBlocker?**<br />
MaliceBlocker is a script (/server/MaliceBlocker.js) which helps to protect servers from DDoS attacks.<br />
Usually DDoS attacks are attacks which constantly send request packets to a server in order to slow it down, MaliceBlocker's function is to detect this and block the IPs which constantly ping the server.

MaliceBlocker has a series of checks which it matches each request against. It has a folder called /mb_data/ where it stores all of its data.

MaliceBlocker tries to be as non-disk-intensive as possible, but there are times where it writes to the disk, these include every request made and every malicious request made.

**How does it block IPs?**<br />
MaliceBlocker creates a file in /mbdata/blocked/ with the IP that is blocked, the rest of the server will always check if the request IP exists in this directory and if so, it will end the request with an Error 500.

**How do I unblock someone?**<br />
MaliceBlocker will NOT automatically unblock someone, to unblock someone, follow these steps:

- Get the IP of the person you want to unblock (lets say its 12.34.56.78)<br />
- Remove all punctuation from the IP, this includes "." and "/" and ":" and any other non alphanumeric character, so for our IP its (12345678). Remember this new IP<br />
- Look for the file /mbdata/blocked/IPHERE.json where IPHERE is the IP without any punctuation.<br />
If you can't find it, that IP was not blocked.<br />
If you can, delete the file, the IP is now unblocked!

**How do I know someone is blocked?**<br />
You will see the following message in the console:
```
[MaliceBlocker] SEVERE: BLOCKED IP iphere. Met or exceeded failing one or more limits for checknamehere
Until unblocked, the server will ignore any requests from this user. 
```