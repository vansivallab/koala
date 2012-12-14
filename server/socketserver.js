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

/*
recieve 		->		emit {valid: true/false} send for all
-----------------------------------------------------------
login 			->		loginCallback(connKey, userObj.userCanvasIds)
getCanvasList 	->		getCanvasListCallback(userObj.userCanvasIds)
createCanvas/selectCanvas -> loadCanvas(canvasObj.userCanvasId, canvasObj.strokes, canvasObj.usernames, canvasObj.userConns)
inviteUser		->		inviteUserCallback()
addStroke		->		addStrokeCallback()
logout			-> 
*/

io.sockets.on('connection', function(socket){
	socket.session = {};
	
	//login
	socket.on('login', function(data) {
		if(Util.isValidUsername(data.username) && Util.isValidPassword(data.password)) {
			data.username = data.username.toLowerCase();
			return koalaDB.login(data.username, data.password, function(userObj, retData) {
				if(retData.valid) {
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
		}
		else {
			return socket.emit('loginCallback', {valid: false});
		}
	});
	
	socket.on('getCanvasList', function(data) {
		if(Util.isValidConn(socket, data) && Util.exists(socket.session.userObj)) {
			socket.emit('getCanvasListCallback', {
				valid: true,
				canvasIds: socket.session.userObj.userCanvasIds 
			});
		}
		else {socket.emit('getCanvasListCallback', {valid: false});}
	});
	
    socket.on('createCanvas', function(data) {
		console.log("socketserver line30: socket, data");
		console.log(JSON.stringify(socket.session));
		console.log(JSON.stringify(data));
		if(Util.isValidConn(socket, data) && Util.exists(socket.session.userObj)) {
			console.log("socketserver line32");
			if(Util.exists(socket.session.canvasObj)) {
				socket.session.canvasObj.removeUserConn(socket.session.userObj.username);
			}
			socket.session.userObj.createCanvas(function(canvasObj) {
				if(Util.exists(canvasObj)) {
					socket.session.canvasObj = canvasObj;
					socket.join(canvasObj.userCanvasId);
					console.log('ss line40: '+JSON.stringify(canvasObj));
					socket.emit('loadCanvas', {
						valid: true, 
						canvasId: socket.session.canvasObj.userCanvasId, 
						strokes: socket.session.canvasObj.strokes,
						users: socket.session.canvasObj.usernames, //people with access
						userConns: socket.session.canvasObj.userConns //people currently drawing
					});
				}
				else {socket.emit('loadCanvas', {valid: false});}
			});
		}
		else {socket.emit('loadCanvas', {valid: false});}
	});
	
	socket.on('selectCanvas', function(data) {
		//pick load session.canvasObj
		if(Util.isValidConn(socket, data) && Util.isValidCanvasId(data.canvasId)
			&& Util.exists(socket.session.userObj)) {
			
			if(Util.exists(socket.session.canvasObj)) {
				socket.session.canvasObj.removeUserConn(socket.session.userObj.username);
			}
			Util.setSocketCanvas(socket, data.canvasId, function(valid) {
				if(valid) {
					//console.log("into addUserConn");
					socket.session.canvasObj.addUserConn(socket.session.userObj.username);
					//console.log("outof addUserConn");
					socket.emit('loadCanvas', {
						valid: true, 
						canvasId: socket.session.canvasObj.userCanvasId, 
						strokes: socket.session.canvasObj.strokes,
						users: socket.session.canvasObj.usernames, //people with access
						userConns: socket.session.canvasObj.userConns //people currently drawing
					});
				}
				else {socket.emit('loadCanvas', {valid: false});}
			});
		}
		else {socket.emit('loadCanvas', {valid: false});}
	});
	
	socket.on('addStroke', function(data) {
		if(Util.isValidConn(socket, data) && Util.exists(socket.session.canvasObj) 
			&& socket.session.canvasObj.userCanvasId === data.canvasId) {
			console.log("socketserver addStroke");
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
			socket.emit("addStrokeCallback", {valid: true});
		}
		else {socket.emit("addStrokeCallback", {valid: false});}
	});
	
	socket.on('inviteUser', function(data) {
		console.log("\n---inviting user: "+data.inviteUsername+" ---");
		if(Util.isValidConn(socket, data) && Util.exists(socket.session.canvasObj)) {
			console.log("validation complete...");
			koalaDB.getUser({username: data.inviteUsername}, function(inviteUserObj) {
				console.log("inviting: "+JSON.stringify(inviteUserObj));
				if(Util.exists(inviteUserObj)) {
					var updated = false;
					
					console.log("adding canvas");
					inviteUserObj.addCanvasObj(socket.session.canvasObj, function() {
						console.log("added canvas: "+socket.session.canvasObj.userCanvasId
							+" to user: "+inviteUserObj.username);
						if(updated) {socket.emit('inviteUserCallback', {valid: true});}
						updated = true;
						/*if(updated) {
							var inviteSocket = io.sockets[inviteUserObj.username];
							console.log(JSON.stringify(inviteSocket));
							if(Util.exists(inviteSocket)) {
								koalaDB.getUser({username: inviteSocket.session.userObj.username}, function (userObj) {
									inviteSocket.session.userObj = userObj;	
									
									inviteSocket.emit('loginCallback', {validConn: true,
										connKey: inviteSocket.session.connKey,
										canvasIds: inviteSocket.userObj.userCanvasIds});
								});
								
								inviteSocket.emit("relogin");
							}
						}
						updated = true;*/
					});
					
					console.log("adding user");
					socket.session.canvasObj.addUserObj(inviteUserObj, function() {
						console.log("added user: "+inviteUserObj.username
							+" to canvas: "+socket.session.canvasObj.userCanvasId);
						if(updated) {socket.emit('inviteUserCallback', {valid: true});}
						updated = true;
						/*if(updated) {
							var inviteSocket = io.sockets[inviteUserObj.username];
							console.log(JSON.stringify(inviteSocket));
							if(Util.exists(inviteSocket)) {
								koalaDB.getUser({username: inviteSocket.session.userObj.username}, function (userObj) {
									inviteSocket.session.userObj = userObj;	
									
									inviteSocket.emit('loginCallback', {validConn: true,
										connKey: inviteSocket.session.connKey,
										canvasIds: inviteSocket.userObj.userCanvasIds});
								});
								
								//inviteSocket.emit("relogin");
							}
						}
						updated = true;*/
					});
				}
				else {socket.emit('inviteUserCallback', {valid: false});}
			});
		}
		else {socket.emit('inviteUserCallback', {valid: false});}
	});
	
	socket.on('logout', function(data) {
		console.log('---disconnecting---');
		console.log('socket ses: '+JSON.stringify(socket.session));
		var canvasObj = socket.session.canvasObj;
		var user = socket.session.userObj;
		/*if(Util.isValidConn(socket, data) && Util.exists(canvasObj)) {
			canvasObj.removeUserConn(user.username);
		}*/
	});
});
