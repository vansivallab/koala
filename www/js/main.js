//main.js
window.onload = function() {
	window.socket = io.connect('http://128.237.150.158:3000/');
	window.util.patchFnBind();
	var paint = new Paint("mainCanvas", "imageDelta", "imageTmp", "mergeCanvas");
	paint.toolbox.setWidth(5);
	paint.toolbox.setOpacity(0.1);
	paint.toolbox.setMode("pencil");
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
	
	socket.emit('send', data);
	strokeCount++;
}