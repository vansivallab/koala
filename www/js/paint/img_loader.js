var ImgLoader = function (canvasid) {
    var imgloader = this;
    this._canvas = document.getElementById(canvasid);
    this._context = this._canvas.getContext('2d');

    this.setCanvas = function (canvasid) {
        imgloader._canvas = document.getElementById(canvasid);
        imgloader._context = imgloader._canvas.getContext('2d');
    };

    this.loadPNG = function (png) {
		if(!png) {return;}
        imgloader.clearCanvas();
        var img = new Image();
        img.src = png;
        img.onload = function () {
            imgloader._context.drawImage(img, 0, 0);
        }
    };

    this.getPNG = function (callback) {
		if(callback) {return callback(imgloader._canvas.toDataURL('image/png'));}
        return imgloader._canvas.toDataURL('image/png');
    };

    this.drawCanvas = function (/*Canvas Elem*/some_canvas) {
        //console.log(some_canvas);
        //console.log(imgloader._context);
        imgloader._context.drawImage(some_canvas, 0, 0, 400, 300);
        window.mergedImg = imgloader;
        //alert('asdf');
    };

    this.clearCanvas = function () {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    };
};