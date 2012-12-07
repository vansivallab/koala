var mongoose = require('mongoose');
var User = require('../models/userModel.js');
var Util = require('../util.js');

var UserController = {
	newUser: function(username, password, /*superuser,*/ callback) {
		User.findOne({username: username}, function(err, result) {
			if(!Util.exists(result)) {
				result = new User({
					username: username,
					/*superuser: superuser,*/
					password: password, 
					userCanvasIds: []
				});
				
				result.lastLoginTimestamp = result.registeredTimestamp = new Date();
				result.save(function(err) {
					if(err) {throw err;}
					return callback(result);
				});
				
			}
			else {return callback(NULL);}
		});
	},

	authUser: function(username, password, callback) {
		console.log("line 28");
		User.findOne({username: username}, function(err, result) {
			console.log("UC line 30");
			if(err) {
				console.log("error line 32");
				console.log(JSON.stringify(err));
				throw err;
			}
			console.log("authorizing user...");
			console.log(JSON.stringify(result));
			//return null if username exists, but password doesnt match
			//return undefined if no username
			//return user if username and password exist
			console.log(password);
			if(Util.exists(result) && result.password === password) {
				result = -1;
			}
			
			if(Util.exists(callback)) {
				return callback(Util.exists(result));
			}
		});
	}
}

module.exports = UserController;