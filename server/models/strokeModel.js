var mongoose = require('mongoose');

var StrokeSchema = new mongoose.Schema({
	username: String,
	userStrokeId: Number,
	drawData: Object,
	timeStamp: Date
});

module.exports = mongoose.model('Stroke', StrokeSchema);