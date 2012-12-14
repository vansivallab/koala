var mongoose = require('mongoose');
var UserController = require('./userController.js');
var User = require('../models/userModel.js');
var CanvasController = require('../controllers/canvasController.js');
var Canvas = require('../models/canvasModel.js');
var Util = require('../util.js');


function KoalaDB(connection) {
	mongoose.connect(connection);
	this.connections = [];
}

KoalaDB.prototype.addUser = function(username, password/*, superuser*/, callback) {
	UserController.newUser(username, password/*, superuser*/, callback);
	//need to validate data
};

KoalaDB.prototype.getUser = function(searchJSON, callback) {
	UserController.findOne(searchJSON, callback);
};

KoalaDB.prototype.clearData = function(callback) {
	User.find({}).remove();
	Canvas.find({}).remove();
	if(Util.exists(callback)) {callback();}
};

KoalaDB.prototype.getCanvases = function(searchJSON, userId, callback) {
	return Canvas.find(searchJSON, function(err, results) {
		if(err) {
			console.log("\n--koalaDBController.js 32 ERR: "+err+"--\n");
			if(Util.exists(callback)) {return callback(null);}
		}
		else if(Util.exists(callback)) {return callback(results);}
	});
};

//or register
KoalaDB.prototype.login = function(username, password, callback) {
	console.log("KBController line 39 loggin in");
	UserController.authUser(username, password, function(validity, userObj) {
		var retData = {valid: validity !== -1};
		
		//if user doesnt exist, make one
		if(validity === 0) {
			return this.addUser(username, password, function(newUserObj) {
				return callback(newUserObj, retData); //assume user creation sucessful
			});
		}
		else if(validity){
			userObj.lastLoginTimestamp = new Date();
			return callback(userObj, retData);
		}
		else {
			return callback({}, retData);
		}
	}.bind(this));
};

module.exports = KoalaDB;