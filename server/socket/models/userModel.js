var mongoose = require('mongoose');
//var passportLocalMongoose = require('passport-local-mongoose');
var newCanvas = require('../controllers/canvasController.js');
var Util = require('../util.js');

var UserSchema = new mongoose.Schema({
    registeredTimestamp: Date,
    lastLoginTimestamp: Date,
	username: String,
	password: String,
    //superuser: Boolean,
	userCanvasIds: Array
});

//UserSchema.plugin(passportLocalMongoose); //adds username, password to schema

UserSchema.methods.addCanvas = function(userCanvasId) {
	if(this.userCanvasIds.find(userCanvasId) !== -1) 
	{
		var canvas = newCanvas(userCanvasId);
		this.userCanvasIds.push(canvas.userCanvasId);
		return canvas.userCanvasId;
	}
	
	return "";
};

UserSchema.methods.hasCanvas = function(userCanvasId) {
	return (this.userCanvasIds.find(userCanvasId) !== -1);
};

UserSchema.methods.getCanvas = function(userCanvasId, callback) {
	if(this.hasCanvas(userCanvasId)) {
		return Canvas.findOne({'userCanvasId': this.userCanvasId}, function(err, result) {
			if(err) {throw err;}
			if(Util.exists(callback)) {return callback(result);}
		});
	}
};

module.exports = mongoose.model('User', UserSchema);