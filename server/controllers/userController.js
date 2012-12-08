var mongoose = require('mongoose');
var User = require('../models/userModel.js');
var Util = require('../util.js');


var UserController = {
	newUser: function(username, password, /*superuser,*/ callback) {
		User.findOne({username: username}, function(err, user) {
			if(err) {throw err;}
			
			if(!Util.exists(user)) {
				user = new User({
					username: username,
					/*superuser: superuser,*/
					password: password, 
					userCanvasIds: []
				});
				
				user.lastLoginTimestamp = user.registeredTimestamp = new Date();
				user.save(function(err) {
					if(err) {throw err;}
					return callback(user);
				});
				
			}
			else {return callback(user);}
		});
	},

	//validity is 1 if authorized
	//validity is 0 if username not found
	//validity is -1 if username found, but password doesnt match
	authUser: function(username, password, callback) {
		User.findOne({username: username}, function(err, result) {
			if(err) {
			console.log(err);
			throw err;}
			console.log("line36 urname: "+username+" result: ");
			console.log(JSON.stringify(result));
			console.log("-------------\n");
			
			var validity = 0;
			if(Util.exists(result)) {
				if(Util.exists(result.password) && result.password === password) 
				{validity = 1;}
				
				else {validity = -1;}
			}
			
			if(Util.exists(callback)) {
				return callback(validity, result);
			}
		});
	},
	
	findOne: function(searchJSON, callback) {
		User.findOne(searchJSON, function(err, userObj) {
			if(err) {throw err;}
			if(Util.exists(callback)) {return callback(userObj);}
		});
	}
}

module.exports = UserController;