var mongoose = require('mongoose');

var CanvasSchema = new mongoose.Schema({
	userId: String,
	strokeId: Number,
	tool: String,
	event: Number,
	pX: Number,
	pY: Number,
	nX: Number,
	nY: Number,
	dateStamp: Date
});

module.exports = mongoose.model('CanvasModel', CanvasSchema);