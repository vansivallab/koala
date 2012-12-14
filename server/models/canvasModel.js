var mongoose = require('mongoose');
var Stroke = require('../models/strokeModel.js');
var User = require('./userModel.js');
var Util = require('../util.js');

var CanvasSchema = new mongoose.Schema({
	_creatorIds: String,
	usernames: Array,
	userConns: Array,
	userCanvasId: String,
	strokes: Array,
	saveCount: Number, //should be the length of stroeks
	saveInterval: Number
});

CanvasSchema.methods.addStroke = function(data, callback) {
	var newStroke = new Stroke({
		username: data.username,
		userStrokeId: data.strokeId,
		drawData: data.drawData,
		timeStamp: new Date()
	});
	
	this.strokes.push(newStroke);
	
	//need to validate data
	this.saveCount++;
	console.log("we may save in addStroke: "+this.saveCount+" "+this.strokes.length);
	/*for some reason this.saveInterval (6) doesnt work, 
	maybe because of too many object accesses*/
	if(this.strokes.length%10 === 0 && this.saveCount > 0) {
		console.log("saving...");
		this.saveCount = 0;
		this.save(function(err) {
			if(err) {throw err;}
			console.log("+++ saving stroke +++");
			if(Util.exists(callback)) {callback(newStroke);}
		});
	}
	
};

CanvasSchema.methods.getStrokes = function(callback) {
	callback(this.strokes);
	return this.strokes;
};

CanvasSchema.methods.addUser = function(inviteUsername, callback) {
	if(this.usernames.indexOf(inviteUsername) === -1) {
		this.usernames.push(inviteUsername);
		
		this.save(function(err) {
			if(err) {throw err;}
			if(Util.exists(callback)) {callback(inviteUsername);}
		});
	}
};

CanvasSchema.methods.addUserObj = function(userObj, callback) {
	if(this.usernames.indexOf(userObj.username) === -1) {
		this.usernames.push(userObj.username);
		
		this.save(function(err) {
			if(err) {throw err;}
			if(Util.exists(callback)) {return callback();}
		});
	}
};

CanvasSchema.methods.removeUser = function(inviteUsername, callback) {
	var usernamesIdx = this.usernames.indexOf(inviteUsername);
	if(usernamesIdx !== -1) {
		this.usernames.splice(usernamesIdx, 1);
		this.save(function(err) {
			if(err) {throw err;}
			if(Util.exists(callback)) {callback(inviteUsername);}
		});
	}
};

CanvasSchema.methods.addUserConn = function(username, callback) {
	if(this.userConns.indexOf(username) === -1) {
		this.userConns.push(username);
		this.save(function(err) {
			if(err) {throw err;}
			if(Util.exists(callback)) {callback(inviteUsername);}
		});
	}
};

CanvasSchema.methods.removeUserConn = function(username, callback) {
	var usernameIdx = this.userConns.indexOf(username);
	if(usernameIdx !== -1) {
		this.userConns.splice(usernameIdx, 1);
		this.save(function(err) {
			if(err) {throw err;}
			if(Util.exists(callback)) {callback(inviteUsername);}
		});
	}
};

CanvasSchema.methods.clearData = function() {
	this.strokeIds = [];
};

module.exports = mongoose.model('Canvas', CanvasSchema);