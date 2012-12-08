//clientSocket.js

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
			window.mainCanvasDLib.drawRect(entry.drawData.x1, entry.drawData.y1, 
				entry.drawData.x2, entry.drawData.y2, entry.drawData.color,
				entry.drawData.width, entry.drawData.opacity);
		}
		else if(entry.drawData.tool === 'line' || entry.drawData.tool === 'pencil') {
			window.mainCanvasDLib.drawLine(entry.drawData.x1, entry.drawData.y1, 
				entry.drawData.x2, entry.drawData.y2, entry.drawData.color,
				entry.drawData.width, entry.drawData.opacity)
		}
		else if(entry.drawData.tool === 'circle') {
			window.mainCanvasDLib.drawCircle(entry.drawData.x, entry.drawData.y, 
				entry.drawData.radius, entry.drawData.color, 
				entry.drawData.width, entry.drawData.opacity);
		}
		else if(entry.drawData.tool === "eraser") {
			window.mainCanvasDLib.erase(entry.drawData.x1, entry.drawData.y1,
				entry.drawData.x2, entry.drawData.y2, entry.drawData.width);
		}
	}
}    

function newSocket(connAddr) {
	var retSocket = io.connect(connAddr);

	/*****************
	 * Socket Events *
	 *****************/
	retSocket.on('loadCanvasEntry', loadCanvasEntry);

	retSocket.on('loadCanvas', function(data) {
		console.log('loadCanvas');
		console.log(data);
		
		if(util.exists(data.canvasId) && util.exists(data.strokes)) {
			this.e.connData.canvasId = data.canvasId;
			window.mainCanvasDLib.clearCanvas();
			for(var d = 0; d < data.strokes.length; d++) {
				loadCanvasEntry(data.strokes[d]);
			}
		}
		else {
			//tell user canvas is invalid
		}
	});

	//get user data and redirect to pick canvas page 
	retSocket.on('loginCallback', function(data) {
		console.log(data);
		if(data.validConn == true) { //check if user info was valid
			this.e.connData.connKey = data.connKey;
			
			//get list of canvas ids
			var canvasSelectionJSelect = $('#canvasSelection').children('#selectionElements');       
			for(var i = 2; i < data.length; i++) {
				canvasSelectionJSelect.append(loadCanvasElementMarkup(data[i]));            
				canvasSelectionJSelect.append("<div class='divide'></div>");
			}
			
			//redirect 
			navigateTo('#select');
			
		} else {
			$('#error').html("Invalid Username/Password");
		}
	});
	
	/****************************************
	 * My Socket Stuff (Funcitons and Data) *
	 ****************************************/
	
	retSocket.e = {
		socket: retSocket, 
		connData: {
			username: "",
			connKey: "",
			canvasId: ""
		},
		strokeCount: 0
	};
	
	//send username and password 
	retSocket.e.login = function(username, password){ //username is an email
		this.connData.username = username;
		console.log(this);
		this.socket.emit('login', {username: username, password: password});
	};

	// drawData = {tool, event, x1, y1, x2, y2} or {tool, event, x, y, radius}
	// tool is "rectangle"
	// event is -1 is up, 0 is move, 1 is down
	// x1, y1 is starting point
	// x2, y2 is ending point
	// color, width, opacity
	retSocket.e.sendStrokeData = function(drawData){
		var data = {
			userStrokeId: this.connData.username+'_'+this.strokeCount,
			drawData: drawData
		};
		
		$.extend(true, data, this.connData);
		
		//console.log(data);
		this.socket.emit('addStroke', data);
		this.strokeCount++;
	};

	retSocket.e.createCanvas = function() {
		this.socket.emit('createCanvas', this.connData);
	};

	retSocket.e.selectCanvas = function(canvasId) {
		var data = {}
		$.extend(true, data, this.connData);
		data.canvasId = canvasId;
		this.socket.emit('selectCanvas', data);
		console.log('send selectCanvas', data);
	};
	
	return retSocket;
}
