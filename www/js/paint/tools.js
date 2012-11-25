// vim: set et ts=4 sts=4 sw=4:

var Tools = function (/*delta Canvas Elem*/imgView, /*Canvas Elem*/tmpView) {
    var tool = this;
    this.tool = tool;
    var canvas = tmpView;
    context = canvas.getContext('2d');

    this.context = context;
    this.canvas = canvas;

    var imgView_context = imgView.getContext('2d');

    this.isMouseDown = false;

    this.setColor = function (color) { context.strokeStyle = color; };
    this.setWidth = function (width) { context.lineWidth = width; };
    this.setOpacity = function (opacity) { context.globalAlpha = opacity; };

    this.save_history = function () {
        imgView_context.drawImage(canvas, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    // wrapper function for setting modes
    this.setMode = function (mode) {
        if (mode == "rectangle") { this.rect_mode(); }
        else if (mode == "pencil") { this.pencil_mode(); }
        else if (mode == "line") { this.line_mode(); }
        else if (mode == "circle") { this.circle_mode(); }
    };

    // Rectangle Tool
    this.rect_mode = function () {

        var rect = new Rect(0, 0, 0, 0);

        this.mousedown = function (/*Event Obj*/ e) {
            if (tool.isMouseDown) return;

			$("#message").html("startDraw");

            tool.isMouseDown = true;
            rect.x1 = e._x; // store initial x,y coordinate
            rect.y1 = e._y;
        };

        this.mousemove = function (/*Event Obj*/ e) {
            if (!tool.isMouseDown) return;

            var x = Math.min(e._x, rect.x1);
            var y = Math.min(e._y, rect.y1);
            var w = Math.abs(e._x - rect.x1);
            var h = Math.abs(e._y - rect.y1);

            context.clearRect(0, 0, canvas.width, canvas.height);

            if (!w || !h) return;

            context.strokeRect(x, y, w, h);
        };

        this.mouseup = function (/*Event Obj*/ e) {
            if (tool.isMouseDown) {
                //tool.mousemove(e);
                tool.save_history();
            }
            tool.isMouseDown = false;

            rect.x2 = e._x;
            rect.y2 = e._y;
        };


        this.touchstart = function (/*Event Obj*/ e) {
            if (tool.isMouseDown) return;

            tool.isMouseDown = true;
            
            // store initial x,y coordinates
            rect.x1 = e.touches[0].clientX;
            rect.y1 = e.touches[0].clientY;
        };

        this.touchmove = function (/*Event Obj*/ e) {
            if (!tool.isMouseDown) return;

            var x = Math.min(e.touches[0].clientX, rect.x1);
            var y = Math.min(e.touches[0].clientY, rect.y1);
            var w = Math.abs(e.touches[0].clientX - rect.x1);
            var h = Math.abs(e.touches[0].clientY - rect.y1);

            context.clearRect(0, 0, canvas.width, canvas.height);

            if (!w || !h) return;

            context.strokeRect(x, y, w, h);
        };

        this.touchend = function (/*Event Obj*/ e) {
            if (tool.isMouseDown) {
                //tool.mousemove(e);
                tool.save_history();
            }
            tool.isMouseDown = false;

            $("#message").html("touchend");

            rect.x2 = e.touches[0].clientX;
            rect.y2 = e.touches[0].clientY;
        };


    }

    // Line Tool
    this.line_mode = function () {
        this.mousedown = function (/*Event Obj*/ e) {
            if (tool.isMouseDown) return;
            tool.isMouseDown = true;
            tool.x0 = e._x; // store initial x,y coordinate
            tool.y0 = e._y;
        };

        this.mousemove = function (/*Event Obj*/ e) {
            if (!tool.isMouseDown) return;
            context.clearRect(0, 0, canvas.width, canvas.height);

            context.beginPath();
            context.moveTo(tool.x0, tool.y0);
            context.lineTo(e._x, e._y);
            context.stroke();
            context.closePath();
        };

        this.mouseup = function (/*Event Obj*/e) {
            if (tool.isMouseDown) {
                //tool.mousemove(e);
                tool.save_history();
            }
            tool.isMouseDown = false;
        };

        this.touchstart = function (/*Event Obj*/ e) {
            if (tool.isMouseDown) return;
            tool.isMouseDown = true;

            // store initial x, y coordinates
            tool.x0 = e.touches[0].clientX;
            tool.y0 = e.touches[0].clientY;
        };

        this.touchmove = function (/*Event Obj*/ e) {
            if (!tool.isMouseDown) return;
            context.clearRect(0, 0, canvas.width, canvas.height);

            context.beginPath();
            context.moveTo(tool.x0, tool.y0);
            context.lineTo(e.touches[0].clientX, e.touches[0].clientY);
            context.stroke();
            context.closePath();
        };

        this.touchend = function (/*Event Obj*/ e) {
            if (tool.isMouseDown) {
                //tool.mousemove(e);
                tool.save_history();
            }
            tool.isMouseDown = false;
        };

    };

    // Pencil Tool
    this.pencil_mode = function () {

        this.mousedown = function (e) {
            if (tool.isMouseDown) { return; }
            context.beginPath();
			$("#message").html("touchstart");
            context.moveTo(e._x, e._y);
            tool.isMouseDown = true;
        };

        this.mousemove = function (e) {
            if (tool.isMouseDown) {
				$("#message").html("touchmove");
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.lineTo(e._x, e._y);
                context.stroke();
            }
        };

        this.mouseup = function (e) {
            if (tool.isMouseDown) {
                tool.save_history();
            }
            tool.isMouseDown = false;
        };

        this.touchstart = function (e) {
            if (tool.isMouseDown) { return; }
            context.beginPath();
            context.moveTo(e.touches[0].clientX, e.touches[0].clientY);
            tool.isMouseDown = true;
        };

        this.touchmove = function (e) {
            if (tool.isMouseDown) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.lineTo(e.touches[0].clientX, e.touches[0].clientY);
                context.stroke();
            }
        };

        this.touchend = function (e) {
            if (tool.isMouseDown) {
                tool.save_history();
            }
            tool.isMouseDown = false;
        };


    };

    this.circle_mode = function (/*Event Obj*/e) {

        // README: DEAR TA'S, THIS IS INHERITANCE
        var radius = new Line();

        this.startdraw = function (e) {
            if (tool.isMouseDown) { return; }
            tool.isMouseDown = true;

            radius.x1 = e._x;
            radius.y1 = e._y;
        };

        this.draw = function (e) {
            if (tool.isMouseDown) {
                console.log(canvas);
                context.clearRect(0, 0, canvas.width, canvas.height);

                radius.x2 = e._x;
                radius.y2 = e._y;

                context.beginPath();
                context.arc(radius.x1, radius.y1, radius.getLength(), 0, 2 * Math.PI, true);
                context.stroke();
                context.closePath();
            }
        };

        this.enddraw = function (e) {
            if (tool.isMouseDown) {
                tool.save_history();
            }
            tool.isMouseDown = false;
        };
    };
};
