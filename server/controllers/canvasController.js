var mongoose = require('mongoose');
var Canvas = require('../models/canvasModel.js');
var Util = require('../util.js');

var CanvasController = {
	newCanvas: function(userObj, callback) {
		var CC = this;
		var userCanvasId = this.generateCanvasId(6); //11 mill possible canvases
		console.log("canvasController line10: "+userCanvasId);
		console.log("-");
		console.log(JSON.stringify(userObj));
		this.findOne({userCanvasId: userCanvasId}, function(canvasObj) {
			if(!Util.exists(canvasObj)) {
				var result = new Canvas({
					_creatorId: userObj.username,
					userIds: [userObj.username],
					userCanvasId: userCanvasId,
					saveCount: 0,
					saveInterval: 2
				});
				console.log("-");
				console.log(JSON.stringify(result));
				
				
				userObj.userCanvasIds.push(result.userCanvasId);
				
				userObj.save(function(err) {
					if(err) {throw err;}
					//console.log("++line29 saving canvas: "+JSON.stringify(result)+'\n');
					result.save(function(err) {
						if(err) {throw err;}
						//console.log("canvas saved++");
						if(Util.exists(callback)) {
							return callback(result);
						}
					});
				});
			}
			else {
				return CC.newCanvas(userObjId, callback);
			}
		});
	},

	generateCanvasId: function(idLen) {
		var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
		var id = '';
		for(var i = 0; i < idLen; i++) {
			id += chars[Math.round(Math.random()*(chars.length-1))];
		}
		//need to check if id already exists, but it is an async call :(
		return id;
	},
	
	find: function(searchJSON, callback) {
		Canvas.find(searchJSON, function(err, canvasObjs) {
			if(err) {throw err;}
			if(Util.exists(callback)) {return callback(canvasObjs);}
		});
	},
	
	findOne: function(searchJSON, callback) {
		console.log('line63 :'+JSON.stringify(searchJSON));
		Canvas.findOne(searchJSON, function(err, canvasObj) {
			console.log("CC findone: "+JSON.stringify(canvasObj));
			if(err) {throw err;}
			if(Util.exists(callback)) {return callback(canvasObj);}
		});
	}
}

module.exports = CanvasController;