// vim: set et ts=4 sts=4 sw=4:

//main.js
window.onload = function() {
	window.util.patchFnBind();
	window.socket = io.connect('http://localhost:3000/');
	
	var mainCanvasDLib = new DrawingLib(document.getElementById("mainCanvas"));
	var deltaCanvasDLib = new DrawingLib(document.getElementById("imageDelta"));
	window.mainCanvasDLib = mainCanvasDLib;
	window.deltaCanvasDLib = deltaCanvasDLib;


	function isValidEntry(entry) {
		return util.exists(entry.drawData) && typeof(entry.drawData.tool) == 'string' 
				&& ((typeof(entry.drawData.x1) == 'number' && typeof(entry.drawData.y1) == 'number' 
				&& typeof(entry.drawData.x2) == 'number' && typeof(entry.drawData.y2) == 'number')
				|| (entry.drawData.tool === 'circle' && typeof(entry.drawData.x) == 'number'
				&& typeof(entry.drawData.y) == 'number' && typeof(entry.drawData.radius) == 'number'));
	}
	
	function loadCanvasEntry(entry) {
		if(isValidEntry(entry)) {
			if(entry.drawData.tool === 'rectangle') {
				mainCanvasDLib.drawRect(entry.drawData.x1, entry.drawData.y1, 
					entry.drawData.x2, entry.drawData.y2, entry.drawData.color,
					entry.drawData.width, entry.drawData.opacity);
			}
			else if(entry.drawData.tool === 'line' || entry.drawData.tool === 'pencil') {
				mainCanvasDLib.drawLine(entry.drawData.x1, entry.drawData.y1, 
					entry.drawData.x2, entry.drawData.y2, entry.drawData.color,
					entry.drawData.width, entry.drawData.opacity)
			}
			else if(entry.drawData.tool === 'circle') {
				mainCanvasDLib.drawCircle(entry.drawData.x, entry.drawData.y, 
					entry.drawData.radius, entry.drawData.color, 
					entry.drawData.width, entry.drawData.opacity);
			}
            else if(entry.drawData.tool === "eraser") {
                mainCanvasDLib.erase(entry.drawData.x1, entry.drawData.y1,
                    entry.drawData.x2, entry.drawData.y2, entry.drawData.width);
            }
		}
	}
    
    

	//socket events
	window.socket.on('loadCanvasEntry', loadCanvasEntry);

	window.socket.on('loadCanvas', function(data) {
		mainCanvasDLib.clearCanvas();
		for(var d = 0; d < data.length; d++) {
			loadCanvasEntry(data[d]);
		}
	});
    
 
	
};

var strokeCount = 0;
// drawData = {tool, event, x1, y1, x2, y2} or {tool, event, x, y, radius}
// tool is "rectangle"
// event is -1 is up, 0 is move, 1 is down
// x1, y1 is starting point
// x2, y2 is ending point
// color, width, opacity
function sendStrokeData(drawData){
	var data = {
		userId: "foopanda",
		strokeId: strokeCount,
		canvasId: "ad109s",
		drawData: drawData
	}
	
    //console.log(data);
	window.socket.emit('newStroke', data);
	strokeCount++;
}

