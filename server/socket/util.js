//util.js

var Util = {
	isValidCanvasId: function(canvasId) {
		return /^\w+$/.test(canvasId) && canvasId.length === 6;
	},

	exists: function(obj) {
		return obj !== null && obj !== undefined;
	},

	setSocketCanvas: function(socket, canvasId, callback) {
		if(this.exists(socket.userObj)) {
			return socket.userObj.getCanvas(canvasId, function(canvasObj) {
				socket.canvasObj = canvasObj;
				socket.join(canvasObj.userCanvasId);
				if(Util.exists(callback)) {return callback(canvasObj);}
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
	}
}

module.exports = Util;