var mongoose = require('mongoose');
var Stroke = require('../models/strokeModel.js');
var User = require('./userModel.js');
var Util = require('../util.js');

var CanvasSchema = new mongoose.Schema({
	_creatorIds: String,
	userIds: Array,
	//connections: Array,
	userCanvasId: String,
	strokes: Array,
	saveCount: Number,
	saveInterval: Number
});

var i = 0;

CanvasSchema.methods.addStroke = function(data, callback) {
	var newStroke = new Stroke({
		username: data.username,
		userStrokeId: data.strokeId,
		drawData: data.drawData,
		timeStamp: new Date()
	});
	
	this.strokes.push(newStroke);
	
	//need to validate data
	if(this.saveCount%this.saveInterval == 0) {
		this.save(function(err) {
			if(err) {throw err;}
			if(Util.exists(callback)) {callback(newStroke);}
		});
	}
	this.saveCount++;
	
};

CanvasSchema.methods.getStrokes = function(callback) {
	var strokes = this.strokes;
	this.save(function(err) {
		if(err) {throw err;}
		if(Util.exists(callback)) {return callback(strokes);}
	});
};

/*CanvasSchema.methods.addConnection = function(username) {
	if(this.connections.find(username) == -1) {
		this.connections.push(username);
	}
};

CanvasSchema.methods.removeConnection = function(username) {
	var usernameIdx = this.connections.find(username);
	if(usernameIdx != -1) {
		this.connection.splice(usernameIdx, 1);
	}
};*/

CanvasSchema.methods.clearData = function() {
	this.strokeIds = [];
};

module.exports = mongoose.model('Canvas', CanvasSchema);