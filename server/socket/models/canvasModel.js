var mongoose = require('mongoose');

var CanvasSchema = new mongoose.Schema({
	userId: String,
	strokeId: Number,
	drawData: Object,
	dateStamp: Date
});

module.exports = mongoose.model('CanvasModel', CanvasSchema);