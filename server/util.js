//util.js

var Util = {
	exists: function(obj) {
		return obj !== null && obj !== undefined;
	},

	isValidCanvasId: function(canvasId) {
		return this.exists(canvasId) && /^\w+$/.test(canvasId) 
			&& canvasId.length === 6;
	},

	setSocketCanvas: function(socket, userCanvasId, callback) {
		if(this.isValidCanvasId(userCanvasId) && this.exists(socket.session.userObj)) {
			console.log("line15 setSocketCanvas: "+JSON.stringify(socket.session));
			console.log(userCanvasId);
			console.log('\n');
			socket.session.userObj.getCanvas(userCanvasId, function(canvasObj) {
				console.log("line19 setSocketCanvas: "+userCanvasId);
				console.log(JSON.stringify(canvasObj));
				if(Util.exists(canvasObj)) {
					socket.session.canvasObj = canvasObj;
					socket.join(canvasObj.userCanvasId);
					if(Util.exists(callback)) {return callback(canvasObj);}
				}
				else {
					console.log("--asdf--\n");
				}
			});
		}
	},

	generateConnKey: function(len) {
		var result = "";
		for(var l = 0; l < len; l++) {
			var randCharCode = Math.floor(Math.random()*93)+33;
			result += String.fromCharCode(randCharCode);
		}
		return result;
	},

	isValidConn: function(socket, connData) {
		console.log('connection validation');
		console.log(this.exists(socket.session.userObj) && this.exists(socket.session.connKey) && this.exists(connData.connKey)
			 && socket.session.connKey === connData.connKey);
		return this.exists(socket.session.userObj) && this.exists(socket.session.connKey) && this.exists(connData.connKey)
			 && socket.session.connKey === connData.connKey;
	}
}

module.exports = Util;