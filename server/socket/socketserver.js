// Initialize the socket.io library
// Start the socket.io server on port 3000
// Remember.. this also serves the socket.io.js file!
var io = require('socket.io').listen(3000);
var fs = require('fs');

var Canvas = require('./controllers/canvasController.js');
var canvas = new Canvas('mongodb://128.237.150.158:27017/koala/vansiTestCanvas'); //change this

//set up write stream
/*var db = fs.createWriteStream('foo.txt');
db.write('[');
var comma = "";*/

// Listen for client connection event
// io.sockets.* is the global, *all clients* socket
// For every client that is connected, a separate callback is called
var connectionCount = 0;
io.sockets.on('connection', function(socket){
	// Listen for this client's "send" event
	// remember, socket.* is for this particular client
	connectionCount++;
	socket.on('newStroke', function(data) {
		// Since io.sockets.* is the *all clients* socket,
		// this is a broadcast message.

		// Broadcast a "receive" event with the data received from "send"
		//io.sockets.emit('loadStroke', data);
		socket.broadcast.emit('loadCanvasEntry', data);
		
		canvas.addStroke(data);
		
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
	
	canvas.getStroke({}, function(data) {
		socket.emit('loadCanvas', data);
	});
});
