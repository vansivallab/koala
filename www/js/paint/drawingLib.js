//drawingLib.js

function DrawingLib(canvas) {
	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	//this.self = this;
	this.currX = 0;
	this.currY = 0;
	this.color = '#000000';
	this.opacity = 1;
	this.width = 5;
}

DrawingLib.prototype.clearCanvas = function() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

DrawingLib.prototype.setOpacity = function(op) {this.opacity = op;};

DrawingLib.prototype.setWidth = function(width) {this.setWidth = width;};

DrawingLib.prototype.setColor = function(color) {this.setColor = color;};

DrawingLib.prototype.drawRect = function(x1, y1, x2, y2, color, width, opacity) {
	if(util.exists(color)) {this.color = color;}
	if(util.exists(width)) {this.width = width;}
	if(util.exists(opacity)) {this.opacity = opacity;}
	this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.width;
    this.ctx.globalAlpha = this.opacity;
	
	this.ctx.strokeRect(x1, y1, x2, y2);
	this.currX = x2; this.currY = y2;
};

DrawingLib.prototype.drawLine = function(x1, y1, x2, y2, color, width, opacity) {
	if(util.exists(color)) {this.color = color;}
	if(util.exists(width)) {this.width = width;}
	if(util.exists(opacity)) {this.opacity = opacity;}
	this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.width;
    this.ctx.globalAlpha = this.opacity;
	
	this.ctx.beginPath();
	this.ctx.moveTo(x1, y1);
	this.ctx.lineTo(x2, y2);
	this.ctx.closePath();
	this.ctx.stroke();
};

DrawingLib.prototype.drawCircle = function(x, y, radius, color, width, opacity) {
	if(util.exists(color)) {this.color = color;}
	if(util.exists(width)) {this.width = width;}
	if(util.exists(opacity)) {this.opacity = opacity;}
	this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.width;
    this.ctx.globalAlpha = this.opacity; 
	
	this.ctx.beginPath();
	this.ctx.arc(x, y, radius, 0, 2*Math.PI, true);
	this.ctx.stroke();
	this.ctx.closePath();
};


