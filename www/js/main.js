//main.js
var strokeCount = 0;
function sendStrokeData(tEvent, x, y){
	var data = {
		userId: "foopanda",
		strokeId: strokeCount,
		canvasId: "ad109s",
		tEvent: tEvent,
		x: x,
		y: y
	}
	
	socket.emit('send', data);
	strokeCount++;
}