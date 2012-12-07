var mongoose = require('mongoose');
var User = require('./userModel.js');
var Util = require('../util.js');

var CanvasSchema = new mongoose.Schema({
	_creatorIds: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
	userIds: [{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
	connections: [{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
	userCanvasId: String,
	strokeIds: [{type:mongoose.Schema.Types.ObjectId, ref:'Stroke'}]
});

CanvasSchema.methods.addStroke = function(data) {
	var newStroke = new Stroke({
		username: data.username,
		userStrokeId: data.strokeId,
		drawData: data.drawData,
		timeStamp: new Data()
	});
	
	//need to validate data
	newStroke.save(function(err) {
		if(err) {throw err;}
	});
	
	this.strokeIds.push(newStroke._id);
	//this.populate(this.strokes);
	
	this.save(function(err) {
		if(err) {throw err;}
	});
};

CanvasSchema.methods.getStroke = function(searchJSON, callback) {
	searchJSON.canvasId = this.canvasId;
	this.strokeIds.find(searchJSON, function(err, results) {
		if(err) {throw err;}
		if(Util.exists(callback)) {callback(results);}
	});
};

CanvasSchema.methods.addConnection = function(userId) {
	if(this.connections.find(userId) == -1) {
		this.connections.push(userId);
	}
};

CanvasSchema.methods.removeConnection = function(userId) {
	var connIdx = this.connections.find(userId);
	if(connIdx != -1) {
		this.connection.splice(connIdx, 1);
	}
}

CanvasSchema.methods.clearData = function() {
	this.strokeIds = [];
};

module.exports = mongoose.model('Canvas', CanvasSchema);