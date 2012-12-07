var mongoose = require('mongoose');
var UserController = require('./userController.js');
var Util = require('../util.js');

function KoalaDB(connection) {
	mongoose.connect(connection);
	this.connections = [];
}

KoalaDB.prototype.addUser = function(username, password/*, superuser*/) {
	UserController.newUser(username, password/*, superuser*/);
	//need to validate data
};

KoalaDB.prototype.getUser = function(searchJSON, callback) {
	User.find(searchJSON, function(err, results) {
		if(err) {throw err;}
		if(Util.exists(callback)) {return callback(result);}
	});
};

KoalaDB.prototype.clearData = function(callback) {
	User.find({}).remove();
	if(Util.exists(callback)) {callback();}
};

KoalaDB.prototype.getCanvases = function(searchJSON, userId, callback) {
	if(!searchJSON.userIds) {searchJSON.userIds = [userId];}
	else if(searchJSON.userIds.find(userId) === -1) 
	{searchJSON.userIds.push(userId);}
	
	return Canvas.find(searchJSON, function(err, results) {
		if(err) {throw err;}
		if(Util.exists(callback)) {return callback(results);}
	});
};

KoalaDB.prototype.login = function(username, password, callback) {
	//console.log("KBController line 39 loggin in");
	//console.log("asdf: ");//+UserController !== undefined);
	UserController.authUser(username, password, function(userObj) {
		var data = {valid: userObj !== -1, connKey: Util.generateConnKey(256/8)};
		
		//if user doesnt exist, make one
		if(userObj === undefined) {
			return this.addUser(username, password, function() {
				return callback(data); //assume user creation sucessful
			});
		}
		else {
			return callback(data);
		}
	}.bind(this));
};

module.exports = KoalaDB;