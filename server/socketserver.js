// Initialize the socket.io library
// Start the socket.io server on port 3000
// Remember.. this also serves the socket.io.js file!
var io = require('socket.io').listen(3000);
var Util = require('./util.js');
var KoalaDBController = require('.//controllers/koalaDBController.js');
var koalaDB = new KoalaDBController('mongodb://localhost:27017/koala'); //change this
//koalaDB.clearData();


// Listen for client connection event
// io.sockets.* is the global, *all clients* socket
// For every client that is connected, a separate callback is called
//var connectionCount = 0;
io.sockets.on('connection', function(socket){
	//connectionCount++;
	socket.session = {};
	//login
	socket.on('login', function(data) {
		return koalaDB.login(data.username, data.password, function(userObj, retData) {
			if(retData.validConn) {
				socket.session.userObj = userObj;
				retData.canvasIds = userObj.userCanvasIds;
				console.log("logging into");
				console.log(JSON.stringify(userObj));
				retData.connKey = socket.session.connKey = Util.generateConnKey(256/8);
				
				console.log("----------\n");
			}
			
			return socket.emit('loginCallback', retData);
		})
	});
	
	socket.on('createCanvas', function(data) {
		console.log("socketserver line30: socket, data");
		console.log(JSON.stringify(socket.session));
		console.log(JSON.stringify(data));
		if(Util.isValidConn(socket, data)) {
			console.log("socketserver line32");
			socket.session.userObj.createCanvas(function(canvasObj) {
				socket.session.canvasObj = canvasObj;
				socket.join(canvasObj.userCanvasId);
				console.log('ss line40: '+JSON.stringify(canvasObj));
				socket.emit('loadCanvas', {canvasId: canvasObj.userCanvasId, strokes: []});
			});
		}
		else {socket.emit('loadCanvas', {});}
	});
	
	socket.on('selectCanvas', function(data) {
		//pick load session.canvasObj
		if(Util.isValidConn(socket, data) && Util.isValidCanvasId(data.canvasId)) {
			Util.setSocketCanvas(socket, data.canvasId, function(canvasObj) {
				socket.session.canvasObj.addUserConn(socket.session.userObj.username);
				canvasObj.getStrokes(function(strokes) {
					console.log("loadCanvas Strokes: "+JSON.stringify(strokes));
					socket.emit('loadCanvas', {canvasId: data.canvasId, strokes: strokes});
				});
			});
		}
		else {socket.emit('loadCanvas', {});}
	});
	
	socket.on('addStroke', function(data) {
		if(Util.isValidConn(socket, data) && Util.exists(socket.session.canvasObj)) {
			console.log("socketserver line62");
			// Since io.sockets.* is the *all clients* socket,
			// this is a broadcast message.
			socket.session.canvasObj.addStroke(data);
			
			// Broadcast a "receive" event with the data received from "send"
			//io.sockets.emit('loadStroke', data);
			//.to(socket.session.canvasObj.userCanvasId)
			
			console.log("broadcasting to: "+socket.session.canvasObj.userCanvasId);
			//socket.broadcast.join(socket.session.canvasObj.userCanvasId);
			socket.broadcast.to(socket.session.canvasObj.userCanvasId).emit('loadCanvasEntry', data);
		}
	});
	
	socket.on('inviteUser', function(data) {
		if(Util.isValidConn(socket, data) && Util.exists(socket.session.canvasObj)) {
			koalaDB.getUser({username: data.inviteUsername}, function(inviteUserObj) {
				//console.log('\n---trying to invite: data.int
				if(Util.exists(inviteUserObj)) {
					inviteUserObj.addCanvasObj(socket.session.canvasObj);
					socket.session.canvasObj.addUserObj(inviteUserObj);
				}
			});
		}
	});
	
	socket.on('userDisconnect', function(data) {
		console.log('---disconnecting---');
		console.log('socket ses: '+JSON.stringify(socket.session));
		
		if(Util.isValidConn(socket, data) && Util.exists(socket.session.canvasObj)) {
			socket.session.canvasObj.removeUserConn(socket.session.userObj.username);
		}
	});
});
