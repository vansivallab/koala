var PaintMode = function (paintobj, onmousedown, onmousemove) {
    //return function () {
        paintobj.mousedown = function (/*Event Obj*/ e) {
            //console.log("pencil mouse down");
            if (paintobj.isMouseDown) { return; }
            paintobj.context.beginPath();
            paintobj.context.moveTo(e._x, e._y);
            paintobj.isMouseDown = true;
        };

        paintobj.mousemove = function (/*Event Obj*/ e) {
            //console.log("pencil drawing");
            if (paintobj.isMouseDown) {
                paintobj.context.clearRect(0, 0, paintobj.canvas.width, paintobj.canvas.height);
                paintobj.context.lineTo(e._x, e._y);
                paintobj.context.stroke();
            }
        };

        paintobj.mouseup = function (/*Event Obj*/ e) {
            if (paintobj.isMouseDown) {
                paintobj.save_history();
            };
            paintobj.isMouseDown = false;
        };
    //}
};
