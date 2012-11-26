//main.js
window.onload = function() {
	window.util.patchFnBind();
	window.socket = io.connect('http://128.237.150.158:3000/');
	var paint = new Paint("mainCanvas", "imageDelta", "imageTmp", "mergeCanvas");
	paint.toolbox.setWidth(5);
	paint.toolbox.setOpacity(0.1);
	paint.toolbox.setMode("pencil");
	
	//socket events
	window.socket.on('loadStroke', function(data) {
		console.log(data);
		//loading one stroke
	});

	window.socket.on('loadCanvas', function(data) {
		console.log(data);
		//loading an array of strokes, re init canvas
	});
	
}

var strokeCount = 0;
function sendStrokeData(tool, event, x, y){
	var data = {
		userId: "foopanda",
		strokeId: strokeCount,
		canvasId: "ad109s",
		tool: tool,
		event: event,
		x: x,
		y: y
	}
	
	window.socket.emit('newStroke', data);
	strokeCount++;
}