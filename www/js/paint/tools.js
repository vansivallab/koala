// vim: set et ts=4 sts=4 sw=4:

var Tools = function(/*delta Canvas Elem*/imgView, /*Canvas Elem*/tmpView) {
    var tool = this;
    this.tool = tool;
    var canvas = tmpView;
    context = canvas.getContext('2d');

    this.context = context;
    this.canvas = canvas;

    var imgView_context = imgView.getContext('2d');

    this.isMouseDown = false;
	
    this.setColor = function (color) {
        this.color = color;
        //context.strokeStyle = color;
    };
    this.setWidth = function (width) {
        this.width = width;
        //context.lineWidth = width;
    };
    this.setOpacity = function (opacity) {
        this.opacity = opacity;
        //context.globalAlpha = opacity;
    };

    this.save_history = function() {
        imgView_context.drawImage(canvas, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    // wrapper function for setting modes
    this.setMode = function (mode) {
        // reset the variables in case they got lost, e.g. in eraser
        context.strokeStyle = this.color;
        context.lineWidth = this.width;
        context.globalAlpha = this.opacity;
		
        if (mode == "rectangle") { this.rect_mode(); }
        else if (mode == "pencil") { this.pencil_mode(); }
        else if (mode == "line") { this.line_mode(); }
        else if (mode == "circle") { this.circle_mode(); }
        else if (mode == "eraser") { this.eraser_mode(); }
    };

    // Rectangle Tool
    this.rect_mode = function() {
		this.drawData = {tool: "rectangle", event: 1, x1: 0, y1: 0, 
			x2: 0, y2: 0, color: context.strokeStyle, 
			width: context.lineWidth, opacity: context.globalAlpha};
		
        this.mousedown = function(/*Event Obj*/ e) {
            if (tool.isMouseDown) return;

            $("#message").html("startDraw");

            tool.isMouseDown = true;

            this.drawData.x1 = e._x; // store initial x,y coordinate
            this.drawData.y1 = e._y;
        };

        this.mousemove = function(/*Event Obj*/ e) {
            if (!tool.isMouseDown) return;

            var x = Math.min(e._x, this.drawData.x1);
            var y = Math.min(e._y, this.drawData.y1);
            var w = Math.abs(e._x - this.drawData.x1);
            var h = Math.abs(e._y - this.drawData.y1);

            this.drawData.x2 = e._x;
            this.drawData.y2 = e._y;

            context.clearRect(0, 0, canvas.width, canvas.height);

            if (!w || !h) return;

            context.strokeRect(x, y, w, h);
        };

        this.mouseup = function(/*Event Obj*/ e) {
            if (tool.isMouseDown) {
                //tool.mousemove(e);
                tool.save_history();
            }
            tool.isMouseDown = false;

            // now transmit the information to the server
            sendStrokeData(this.drawData);
        };

        this.touchstart = function(/*Event Obj*/ e) {
            if (tool.isMouseDown) return;

            tool.isMouseDown = true;
            
            // store initial x,y coordinates
            this.drawData.x1 = e.touches[0].clientX;
            this.drawData.y1 = e.touches[0].clientY;
        };

        this.touchmove = function(/*Event Obj*/ e) {
            if (!tool.isMouseDown) return;

            var x = Math.min(e.touches[0].clientX, this.drawData.x1);
            var y = Math.min(e.touches[0].clientY, this.drawData.y1);
            var w = Math.abs(e.touches[0].clientX - this.drawData.x1);
            var h = Math.abs(e.touches[0].clientY - this.drawData.y1);

			this.drawData.x2 = e.touches[0].clientX;
			this.drawData.y2 = e.touches[0].clientY;

            context.clearRect(0, 0, canvas.width, canvas.height);

            if (!w || !h) return;

            context.strokeRect(x, y, w, h);
        };

        this.touchend = function(/*Event Obj*/ e) {
            if (tool.isMouseDown) {
                //tool.mousemove(e);
                tool.save_history();
            }

			// now transmit the information to the server
			sendStrokeData(this.drawData);

            tool.isMouseDown = false;

            $("#message").html("touchend");
        };


    }

    // Line Tool
    this.line_mode = function() {
		this.drawData = {tool: "line", event: 1, x1: line.x1, y1: line.y1, 
			x2: line.x2, y2: line.y2, color: context.strokeStyle, 
			width: context.lineWidth, opacity: context.globalAlpha};
		
        this.mousedown = function(/*Event Obj*/ e) {
            if (tool.isMouseDown) return;
            tool.isMouseDown = true;
            this.drawData.x1 = e._x; // store initial x,y coordinate
            this.drawData.y1 = e._y;
        };

        this.mousemove = function(/*Event Obj*/ e) {
            if (!tool.isMouseDown) return;
            context.clearRect(0, 0, canvas.width, canvas.height);
			this.drawData.x2 = e._x;
			this.drawData.y2 = e._y;
			
            context.beginPath();
            context.moveTo(this.drawData.x1, this.drawData.y1);
            context.lineTo(this.drawData.x2, this.drawData.y2);
            context.stroke();
            context.closePath();
        };

        this.mouseup = function(/*Event Obj*/e) {
            if (tool.isMouseDown) {
                //tool.mousemove(e);
                tool.save_history();
				sendStrokeData(this.drawData);
            }
            tool.isMouseDown = false;
        };

        this.touchstart = function(/*Event Obj*/ e) {
            if (tool.isMouseDown) return;
            tool.isMouseDown = true;

            // store initial x, y coordinates
            this.drawData.x1 = e.touches[0].clientX;
            this.drawData.y1 = e.touches[0].clientY;
        };

        this.touchmove = function(/*Event Obj*/ e) {
             if (!tool.isMouseDown) return;
            context.clearRect(0, 0, canvas.width, canvas.height);
			this.drawData.x2 = e.touches[0].clientX;
			this.drawData.y2 = e.touches[0].clientY;
			
            context.beginPath();
            context.moveTo(this.drawData.x1, this.drawData.y1);
            context.lineTo(this.drawData.x2, this.drawData.y2);
            context.stroke();
            context.closePath();
        };

        this.touchend = function(/*Event Obj*/ e) {
            if (tool.isMouseDown) {
                //tool.mousemove(e);
                tool.save_history();
				sendStrokeData(this.drawData);
            }
            tool.isMouseDown = false;
        };

    };

    // Pencil Tool
    this.pencil_mode = function() {
		this.drawData ={tool: "pencil", event: 0, x1: 0, y1: 0, 
			x2: 0, y2: 0, color: context.strokeStyle, 
			width: context.lineWidth, opacity: context.globalAlpha};
        
		this.mousedown = function(e) {
            if (tool.isMouseDown) { return; }
			this.drawData.x1 = e._x;
			this.drawData.y1 = e._y;
			$("#message").html("touchstart");
			
            context.beginPath();
            context.moveTo(e._x, e._y);
            tool.isMouseDown = true;
        };

        this.mousemove = function(e) {
            if (tool.isMouseDown) {
                this.drawData.x2 = e._x;
				this.drawData.y2 = e._y;
				context.beginPath();
				context.moveTo(this.drawData.x1, this.drawData.y1);
				
				//context.clearRect(0, 0, canvas.width, canvas.height);
                context.lineTo(this.drawData.x2, this.drawData.y2);
				context.closePath();
                context.stroke();
				
				sendStrokeData(this.drawData);
				tool.save_history();
				this.drawData.x1 = this.drawData.x2;
				this.drawData.y1 = this.drawData.y2;
            }
        };

        this.mouseup = function(e) {
            if (tool.isMouseDown) {
				//context.closePath()
                //tool.save_history();
            }
            tool.isMouseDown = false;
        };

        this.touchstart = function(e) {
            if (tool.isMouseDown) { return; }
            context.beginPath();
            //context.moveTo(e.touches[0].clientX, e.touches[0].clientY);
            tool.isMouseDown = true;
			this.drawData.x1 = e.touches[0].clientX;
			this.drawData.y1 = e.touches[0].clientY;
        };

        this.touchmove = function(e) {
            if (tool.isMouseDown) {
				this.drawData.x2 = e.touches[0].clientX;
				this.drawData.y2 = e.touches[0].clientY;
				
				context.beginPath();
				context.moveTo(this.drawData.x1, this.drawData.y1);
                context.lineTo(this.drawData.x2, this.drawData.y2);
				context.closePath();
                context.stroke();
				
				sendStrokeData(this.drawData);
				tool.save_history();
				this.drawData.x1 = this.drawData.x2;
				this.drawData.y1 = this.drawData.y2;
            }
        };

        this.touchend = function(e) {
            if (tool.isMouseDown) {
            }
            tool.isMouseDown = false;
        };


    };
	
    this.circle_mode = function(/*Event Obj*/e) {
		this.drawData = {tool: "circle", event: 1, x: 0, y: 0, radius: 0,
			color: context.strokeStyle, width: context.lineWidth, 
			opacity: context.globalAlpha};
		
        this.mousedown = function(e) {
            if (tool.isMouseDown) { return; }
            tool.isMouseDown = true;
			this.drawData.x = e._x;
			this.drawData.y = e._y;
        };

        this.mousemove = function(e) {
            if (tool.isMouseDown) {
                context.clearRect(0, 0, canvas.width, canvas.height);

                this.drawData.radius = Math.sqrt(Math.pow(this.drawData.x - e._x, 2)
										+Math.pow(this.drawData.y - e._y, 2));

                context.beginPath();
                context.arc(this.drawData.x, this.drawData.y, 
							this.drawData.radius, 0, 2 * Math.PI, true);
                context.closePath();
				context.stroke();
            }
        };

        this.mouseup = function(e) {
            if (tool.isMouseDown) {
                tool.save_history();

                // now send the information to the server
				sendStrokeData(this.drawData)
            }
            tool.isMouseDown = false;
        };
		
		this.touchstart = function(e) {
            if (tool.isMouseDown) { return; }
            tool.isMouseDown = true;
			this.drawData.x = e.touches[0].clientX;
			this.drawData.y = e.touches[0].clientY;
        };

        this.touchmove = function(e) {
            if (tool.isMouseDown) {
                context.clearRect(0, 0, canvas.width, canvas.height);

                this.drawData.radius = Math.sqrt(Math.pow(this.drawData.x - e.touches[0].clientX, 2)
										+Math.pow(this.drawData.y - e.touches[0].clientY, 2));

                context.beginPath();
                context.arc(this.drawData.x, this.drawData.y, 
							this.drawData.radius, 0, 2 * Math.PI, true);
                context.closePath();
				context.stroke();
            }
        };

        this.touchend = function(e) {
            if (tool.isMouseDown) {
                tool.save_history();

                // now send the information to the server
				sendStrokeData(this.drawData)
            }
            tool.isMouseDown = false;
        };
    };

    this.eraser_mode = function(/*Event Obj*/ e) {

        // JSON obj that we will send to the server
		this.drawData ={tool: "eraser", event: 0, x1: 0, y1: 0, 
			x2: 0, y2: 0, width: context.lineWidth};
        this.prevColor = context.strokeStyle;
		
		this.mousedown = function(/*Event Obj*/ e) {
            if (tool.isMouseDown) { return; }
			this.drawData.x1 = e._x;
			this.drawData.y1 = e._y;
			$("#message").html("touchstart");

            // These are default values for an eraser tool
            context.globalCompositeOperation = "copy";
            context.strokeStyle = "white";
			this.prevColor = context.strokeStyle;

            // Now begins the normal line operation
            context.beginPath();
            context.moveTo(e._x, e._y);
            tool.isMouseDown = true;
        };

        this.mousemove = function(/*Event Obj*/ e) {
            if (tool.isMouseDown) {
                this.drawData.x2 = e._x;
				this.drawData.y2 = e._y;
				context.beginPath();
				context.moveTo(this.drawData.x1, this.drawData.y1);
				
				//context.clearRect(0, 0, canvas.width, canvas.height);
                context.lineTo(this.drawData.x2, this.drawData.y2);
				context.closePath();
                context.stroke();
				
				sendStrokeData(this.drawData);
				tool.save_history();
				this.drawData.x1 = this.drawData.x2;
				this.drawData.y1 = this.drawData.y2;
            }
        };

        this.mouseup = function(e) {
            if (tool.isMouseDown) {
				//context.closePath()
                //tool.save_history();
            }
			context.strokeStyle = this.prevColor;
            tool.isMouseDown = false;
        };
		
		this.touchstart = function(/*Event Obj*/ e) {
            if (tool.isMouseDown) { return; }
			this.drawData.x1 = e.touches[0].clientX;
			this.drawData.y1 = e.touches[0].clientY;
			$("#message").html("touchstart");

            // These are default values for an eraser tool
            context.globalCompositeOperation = "copy";
            context.strokeStyle = "white";
			this.prevColor = context.strokeStyle;

            // Now begins the normal line operation
            context.beginPath();
            context.moveTo(e.touches[0].clientX, e.touches[0].clientY);
            tool.isMouseDown = true;
        };

        this.touchmove = function(/*Event Obj*/ e) {
            if (tool.isMouseDown) {
                this.drawData.x2 = e.touches[0].clientX;
				this.drawData.y2 = e.touches[0].clientY;
				context.beginPath();
				context.moveTo(this.drawData.x1, this.drawData.y1);
				
				//context.clearRect(0, 0, canvas.width, canvas.height);
                context.lineTo(this.drawData.x2, this.drawData.y2);
				context.closePath();
                context.stroke();
				
				sendStrokeData(this.drawData);
				tool.save_history();
				this.drawData.x1 = this.drawData.x2;
				this.drawData.y1 = this.drawData.y2;
            }
        };

        this.touchend = function(e) {
            if (tool.isMouseDown) {
				//context.closePath()
                //tool.save_history();
            }
			context.strokeStyle = this.prevColor;
            tool.isMouseDown = false;
        };

    }
};
