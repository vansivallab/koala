var mongoose = require('mongoose');
var Stroke = require('../models/strokeModel.js');
var Canvas = require('../models/canvasModel.js');

function newCanvas(userObjId) {
	var id = generateCanvasId(6); //11 mill possible canvases
	var result = new Canvas({_creatorId: userObjId, userIds: [userObjId], userCanvasId: id});
	result.save(function(err) {
		if(err) {throw err;}
	});
	return result;
}

function generateCanvasId(idLen) {
	var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	var id = '';
	for(var i = 0; i < idLen; i++) {
		id += chars[Math.round(Math.random()*(chars.length-1))];
	}
	//need to check if id already exists, but it is an async call :(
	return id;
}

module.exports = newCanvas;