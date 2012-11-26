var mongoose = require('mongoose');

var CanvasSchema = new mongoose.Schema({
	userId: String,
	strokeId: Number,
	tool: String,
	event: Number,
	x: Number,
	y: Number,
	dateStamp: Date
});

module.exports = mongoose.model('CanvasModel', CanvasSchema);