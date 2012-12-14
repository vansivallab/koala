var mongoose = require('mongoose');
var User = require('../models/userModel.js');
var Util = require('../util.js');


var UserController = {
	newUser: function(username, password, /*superuser,*/ callback) {
		User.findOne({username: username}, function(err, user) {
			if(err) {
				console.log("\n--userController.js 1o ERR: "+err+"--\n");
				if(Util.exists(callback)) {return callback(null);}
			}
			
			else if(!Util.exists(user)) {
				user = new User({
					username: username,
					/*superuser: superuser,*/
					password: password, 
					userCanvasIds: []
				});
				
				user.lastLoginTimestamp = user.registeredTimestamp = new Date();
				user.save(function(err) {
					if(err) {
						console.log("\n--userController.js 22 ERR: "+err+"--\n");
						if(Util.exists(callback)) {return callback(null);}
					}
					return callback(user);
				});
				
			}
			else if(Util.exists(callback)) {return callback(null);}
		});
	},

	//validity is 1 if authorized
	//validity is 0 if username not found
	//validity is -1 if username found, but password doesnt match
	authUser: function(username, password, callback) {
		User.findOne({username: username}, function(err, result) {
			if(err) {
				console.log("\n--userController.js 38 ERR: "+err+"--\n");
				if(Util.exists(callback)) {return callback(false, null);}
				return;
			}
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
	
	find: function(searchJSON, callback) {
		User.find(searchJSON, function(err, userObjs) {
			if(err) {
				console.log("\n--userController.js 63 ERR: "+err+"--\n");
				if(Util.exists(callback)) {return callback(null);}
			}
			else if(Util.exists(callback)) {return callback(userObjs);}
		});
	},
	
	findOne: function(searchJSON, callback) {
		User.findOne(searchJSON, function(err, userObj) {
			if(err) {
				console.log("\n--userController.js 73 ERR: "+err+"--\n");
				if(Util.exists(callback)) {return callback(false, null);}
			}
			else if(Util.exists(callback)) {return callback(userObj);}
		});
	}
}

module.exports = UserController;