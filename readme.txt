Koala by Vansi(vvallabh), Alex (aguo), and Antara (antaras)
A realtime collaborative drawing application.

How to run:
0. npm install on: express, mongodb, mongoose, socket.io OR download all the files from:
	https://www.dropbox.com/sh/w2qdwk8lhf35hn7/Asw7QUcTHQ
1. edit the ip addresses in www/index.html (line 187) and www/main.js (line 15)
2. start mongodb
3. make sure the port in server/socketserver.js (line 7) points to the mongodb
4. start server/server.js and server/socketserver.js on the same machine as the mongodb
5. go to the ip address port 8080
Note: login in with an unregistered username creates a new user