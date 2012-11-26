// vim: set et ts=4 sts=4 sw=4:

//main.js
window.onload = function() {
	window.util.patchFnBind();
	window.socket = io.connect('http://128.237.116.117:3000/');
	//var paint = new Paint("mainCanvas", "imageDelta", "imageTmp", "mergeCanvas");
    var paint = new Paint("imageDelta", "imageTmp");
	paint.toolbox.setWidth(5);
	paint.toolbox.setOpacity(0.1);
	paint.toolbox.setMode("rectangle");
	
	var mainCanvasDLib = new DrawingLib(document.getElementById("mainCanvas"));
	var deltaCanvasDLib = new DrawingLib(document.getElementById("imageDelta"));

	window.mainCanvasDLib = mainCanvasDLib; //debug
	window.deltaCanvasDLib = deltaCanvasDLib;
	mainCanvasDLib.drawRect(0,0,100, 100);
	
	function isValidEntry(entry) {
		return util.exists(entry.drawData) && typeof(entry.drawData.tool) == 'string' 
				&& ((typeof(entry.drawData.pX) == 'number' && typeof(entry.drawData.pY) == 'number' 
				&& typeof(entry.drawData.nX) == 'number' && typeof(entry.drawData.nY) == 'number')
				|| (entry.drawData.tool === 'circle' && typeof(entry.drawData.x) == 'number' 
				&& typeof(entry.drawData.y) == 'number' && typeof(entry.drawData.radius) == 'number'));
	}
	
	function loadCanvasEntry(entry) {
		if(isValidEntry(entry)) {
			if(entry.drawData.tool === 'rectangle') {
				mainCanvasDLib.drawRect(entry.drawData.pX, entry.drawData.pY, entry.drawData.nX, entry.drawData.nY);
			}
			else if(entry.drawData.tool === 'pencil') {
				mainCanavasDLib.drawLine(entry.drawData.pX, entry.drawData.pY, entry.drawData.nX, entry.drawData.nY);
			}
			else if(entry.drawData.tool === 'circle') {
				mainCanavasDLib.drawLine(entry.drawData.x, entry.drawData.y, entry.drawData.radius);
			}
		}
	}

	//socket events
	window.socket.on('loadCanvasEntry', loadCanvasEntry);

	window.socket.on('loadCanvas', function(data) {
		for(var d = 0; d < data.length; d++) {
			loadCanvasEntry(data[d]);
		}
	});
	
};

var strokeCount = 0;
// drawData = {tool, event, pX, pY, nX, nY} or {tool, event, x, y, radius}
// tool is "rectangle"
// event is -1 is up, 0 is move, 1 is down
// pX, pY is starting point
// nX, nY is ending point
function sendStrokeData(drawData){
	var data = {
		userId: "foopanda",
		strokeId: strokeCount,
		canvasId: "ad109s",
		drawData: drawData
	}
	
    console.log(data);
	window.socket.emit('newStroke', data);
	strokeCount++;
}

