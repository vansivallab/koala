// vim: set et ts=4 sts=4 sw=4:

var PaintApp = function() {
    this.init();
}

PaintApp.prototype.init = function() {
    this.canvas = $("#paint_canvas")[0];
    this.canvas.addEventListener('touchstart', this.start);
    this.canvas.addEventListener('touchmove', this.move);
}

PaintApp.prototype.move = function() {
    alert("something");
}

PaintApp.prototype.start = function() {
    alert("something else");
}
