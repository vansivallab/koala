var mongoose = require('mongoose');
//var passportLocalMongoose = require('passport-local-mongoose');
var CanvasController = require('../controllers/canvasController.js');
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

UserSchema.methods.createCanvas = function(callback) {
	console.log("userModel line18");
	var user = this;
	CanvasController.newCanvas(this, function(canvasObj) {
		console.log("userModel line20: created canvas: "+JSON.stringify(canvasObj));
		user.userCanvasIds.push(canvasObj.userCanvasId);
		canvasObj.userIds.push(user.username);
		canvasObj.save(function(err) {
			if(err) {throw err;}
			user.save(function(err) {
				if(err) {throw err;}
				if(Util.exists(callback)) {return callback(canvasObj);}
			});
		});
	});
};

UserSchema.methods.addCanvas = function(userCanvasId, callback) {
	if(!this.hasCanvas(userCanvasId)) {
		var user = this;
		CanvasController.findOne(userCanvasId, function(canvasObj) {
			if(Util.exists(canvasObj)) {
				user.userCanvasIds.push(canvasObj.userCanvasId);
				canvasObj.userIds.push(user.username);
				canvasObj.save(function(err) {
					if(err) {throw err;}
					user.save(function(err) {
						if(err) {throw err;}
						if(Util.exists(callback)) {return callback(canvasObj);}
					});
				});
			}
		});
		
	}
};

UserSchema.methods.hasCanvas = function(userCanvasId) {
	return (this.userCanvasIds.indexOf(userCanvasId) !== -1);
};

UserSchema.methods.getCanvas = function(userCanvasId, callback) {
	console.log("--getting Canvas--: "+userCanvasId);
	console.log("hasCanvas="+this.hasCanvas(userCanvasId));
	if(this.hasCanvas(userCanvasId)) {
		return CanvasController.findOne({'userCanvasId': userCanvasId}, callback);
	}
};

module.exports = mongoose.model('User', UserSchema);