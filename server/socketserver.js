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
				socket['nickname'] = userObj.username;
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
				console.log("into addUserConn");
				socket.session.canvasObj.addUserConn(socket.session.userObj.username);
				console.log("outof addUserConn");
				canvasObj.getStrokes(function(strokes) {
					console.log("loadCanvas Strokes: "+JSON.stringify(strokes)+"\n");
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
			
			console.log("broadcasting "+JSON.stringify(data)+" to: "+socket.session.canvasObj.userCanvasId);
			//socket.broadcast.join(socket.session.canvasObj.userCanvasId);
			socket.broadcast.to(socket.session.canvasObj.userCanvasId).emit('loadCanvasEntry', data);
			console.log("broadcast complete");
		}
	});
	
	socket.on('inviteUser', function(data) {
		console.log("\n---inviting user: "+data.inviteUsername+" ---");
		if(Util.isValidConn(socket, data) && Util.exists(socket.session.canvasObj)) {
			console.log("validation complete...");
			koalaDB.getUser({username: data.inviteUsername}, function(inviteUserObj) {
				console.log("inviting: "+JSON.stringify(inviteUserObj));
				if(Util.exists(inviteUserObj)) {
					console.log("adding canvas");
					var updated = false;
					
					inviteUserObj.addCanvasObj(socket.session.canvasObj, function() {
						console.log("added canvas: "+socket.session.canvasObj.userCanvasId
							+" to user: "+inviteUserObj.username);
						
						if(updated) {
							var inviteSocket = io.sockets[inviteUserObj.username];
							console.log(JSON.stringify(inviteSocket));
							if(Util.exists(inviteSocket)) {
								/*koalaDB.getUser({username: inviteSocket.session.userObj.username}, function (userObj) {
									inviteSocket.session.userObj = userObj;	
									
									inviteSocket.emit('loginCallback', {validConn: true,
										connKey: inviteSocket.session.connKey,
										canvasIds: inviteSocket.userObj.userCanvasIds});
								});*/
								
								inviteSocket.emit("relogin");
							}
						}
						updated = true;
					});
					
					console.log("adding user");
					socket.session.canvasObj.addUserObj(inviteUserObj, function() {
						console.log("added user: "+inviteUserObj.username
							+" to canvas: "+socket.session.canvasObj.userCanvasId);
						
						if(updated) {
							var inviteSocket = io.sockets[inviteUserObj.username];
							console.log(JSON.stringify(inviteSocket));
							if(Util.exists(inviteSocket)) {
								/*koalaDB.getUser({username: inviteSocket.session.userObj.username}, function (userObj) {
									inviteSocket.session.userObj = userObj;	
									
									inviteSocket.emit('loginCallback', {validConn: true,
										connKey: inviteSocket.session.connKey,
										canvasIds: inviteSocket.userObj.userCanvasIds});
								});*/
								
								inviteSocket.emit("relogin");
							}
						}
						updated = true;
					});
				}
			});
		}
	});
	
	socket.on('logout', function(data) {
		console.log('---disconnecting---');
		console.log('socket ses: '+JSON.stringify(socket.session));
		var canvasObj = socket.session.canvasObj;
		var user = socket.session.userObj;
		if(Util.isValidConn(socket, data) && Util.exists(canvasObj)) {
			canvasObj.removeUserConn(user.username);
		}
	});
});
