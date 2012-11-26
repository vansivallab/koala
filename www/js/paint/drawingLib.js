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

DrawingLib.prototype.drawRect = function(x1, y1, x2, y2) {
	this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.width;
    this.ctx.globalAlpha = this.opacity;
	this.ctx.strokeRect(x1, y1, x2, y2);
	this.currX = x2; this.currY = y2;
};

DrawingLib.prototype.drawLine = function(x1, y1, x2, y2) {
	this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.width;
    this.ctx.globalAlpha = this.opacity; 
	this.ctx.beginPath();
	this.ctx.moveTo(x1, y1);
	this.ctx.lineTo(x2, y2);
	this.ctx.stroke();
	this.ctx.closePath();
};

DrawingLib.prototype.drawCircle = function(x1, y1, radius) {
	this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.width;
    this.ctx.globalAlpha = this.opacity; 
	this.ctx.beginPath();
	this.ctx.arc(x1, y1, radius, 0, 2*Math.PI, true);
	this.ctx.stroke();
	this.ctx.closePath();
};

/*DrawingLib.prototype.pencil = {
	pX: 0,
	pY: 0,
	start: function(x, y) {
		console.log(this);
		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.pencil.pX = x;
		this.pencil.pY = y;
	}.bind(this.self),
	
	move: function(x, y) {
		this.ctx.strokeStyle = this.color;
		this.ctx.lineWidth = this.width;
		this.ctx.globalAlpha = this.opacity; 
		if(this.
		this.ctx.lineTo(x, y);
		this.ctx.stroke();
	},
	
	end: function() {
		this.ctx.closePath();
	}

};*/

