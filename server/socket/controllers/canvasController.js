var mongoose = require('mongoose');
var Stroke = require('../models/canvasModel.js');

function Canvas(connection) {
	mongoose.connect(connection);
}

Canvas.prototype.addStroke = function(data) {
	var newStroke = new Stroke();
	//need to validate data
	newStroke.userId = data.userId;
	newStroke.strokeId = data.strokeId;
	newStroke.tool = data.tool;
	newStroke.event = data.event;
	newStroke.x = data.x;
	newStroke.y = data.y;
	newStroke.dateStamp = new Date();
	newStroke.save(function(err) {
		if(err) {throw err;}
	});
	
	Stroke.find({}, function (err, items) {
		if(err) {throw err;}
		console.log("all strokes: "+JSON.stringify(items));
	});
}

Canvas.prototype.getStroke = function(searchJSON, callback) {
	Stroke.find(searchJSON, function(err, results) {
		if(err) {throw err;}
		callback(results);
	});
};


module.exports = Canvas;