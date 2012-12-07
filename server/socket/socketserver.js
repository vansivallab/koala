// Initialize the socket.io library
// Start the socket.io server on port 3000
// Remember.. this also serves the socket.io.js file!
var io = require('socket.io').listen(3000);
//var fs = require('fs');
var Util = require('./util.js');
var KoalaDBController = require('.//controllers/koalaDBController.js');
var koalaDB = new KoalaDBController('mongodb://localhost:27017/koala'); //change this
//koalaDB.clearData();
//set up write stream
/*var db = fs.createWriteStream('foo.txt');
db.write('[');
var comma = "";*/

// Listen for client connection event
// io.sockets.* is the global, *all clients* socket
// For every client that is connected, a separate callback is called
var connectionCount = 0;
io.sockets.on('connection', function(socket){
	connectionCount++;
	
	// Listen for this client's "send" event
	// remember, socket.* is for this particular client
	
	//login
	socket.on('login', function(data) {
		return koalaDB.login(data.username, data.password, function(data) {
			socket.connKey = data.connKey;
			return socket.emit('loginCallback', data);
		})
	});
	
	socket.on('selectCanvas', function(data) {
		//pick load session.canvasObj
		if(Util.isValidCanvasId(data.canvasId) && Util.isValidCanvasId(socket.connKey)) {
			Util.setSocketSessionData(socket, data.canvasId, function() {
				socket.session.canvasObj.addConnection(socket.connKey);
				socket.session.canvasObj.getStroke({}, function(data) {
					socket.emit('loadCanvas', data);
				});
			});
		}
		else {socket.emit('loadCanvas', {valid: false});}
	});
	
	socket.on('newStroke', function(data) {
		// Since io.sockets.* is the *all clients* socket,
		// this is a broadcast message.

		// Broadcast a "receive" event with the data received from "send"
		//io.sockets.emit('loadStroke', data);
		socket.session.canvasObj.broadcast.emit('loadCanvasEntry', data);
		
		socket.session.canvasObj.addStroke(data);
		
		//write to db file
		/*db.write(comma+'\n'+JSON.stringify(data));
		comma = ",";*/
		
	});

	/*socket.on('disconnect', function() {
		connectionCount--;
		if(connectionCount === 0) {
			db.write('\n]');
			db.destroy();
		}
	});*/
});
