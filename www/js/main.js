// vim: set et ts=4 sts=4 sw=4:

//main.js
window.onload = function() {
	window.util.patchFnBind();
	window.socket = io.connect('http://128.237.150.158:3000/');
	//var paint = new Paint("mainCanvas", "imageDelta", "imageTmp", "mergeCanvas");
    var paint = new Paint("imageDelta", "imageTmp");
	paint.toolbox.setWidth(5);
	paint.toolbox.setOpacity(0.1);
	paint.toolbox.("pencil");

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
// tool is "rectangle"
// event is -1 is up, 0 is move, 1 is down
// pX, pY is starting point
// nX, nY is ending point
function sendStrokeData(tool, event, pX, pY, nX, nY){
	var data = {
		userId: "foopanda",
		strokeId: strokeCount,
		canvasId: "ad109s",
		tool: tool,
		event: event,
		pX: pX,
		pY: pY,
		nX: nX,
		nY: nY
	}
	
	window.socket.emit('newStroke', data);
	strokeCount++;
}
	
