// vim: set et ts=4 sts=4 sw=4:

//var Paint = function (mainCanvasId, imageDeltaId, imageTmpId, mergeCanvasId, loadingBarsId) {
//var Paint = function (imageDeltaId, imageTmpId) {
var Paint = function (mainCanvasId, imageDeltaId) {
    //this.imgView = $('#' + mainCanvasId);
    //this.img_context = (this.imgView.get(0)).getContext('2d');

// we switched some variable names around.
// imageDeltaId => mainCanvasId
// imageTmpId   => imageDeltaId

    this.delta_canvas = $('#' + mainCanvasId);
    this.tmp_canvas = $('#' + imageDeltaId);

    //this.loadingBars = $('#' + loadingBarsId);

    this.toolbox = new Tools(this.delta_canvas.get(0), this.tmp_canvas.get(0));
    var toolbox = this.toolbox;
    this.toolbox.pencil_mode(); /* Set Default Tool to pencil */

    //* mouse event handlers
    this.tmp_canvas.get(0).addEventListener('mousedown', event_handler, false);
    this.tmp_canvas.get(0).addEventListener('mousemove', event_handler, false);
    document.addEventListener('mouseup', event_handler, false);
    // */

    //* touch event handlers
    this.tmp_canvas.get(0).addEventListener('touchstart', event_handler, false);
    this.tmp_canvas.get(0).addEventListener('touchmove', event_handler, false);
    document.addEventListener('touchend', event_handler, false);
    // */

    //this.tmp_canvas.get(0).addEventListener('mouseout', event_handler, false);

    //this.InitImgLoader = new ImgLoader(mainCanvasId);
    this.DeltaImgLoader = new ImgLoader(mainCanvasId);
    //this.MergeImgLoader = new ImgLoader(mergeCanvasId);

    this._haschanges = false;
    this.setHasChanges = function (/*Bool*/ val) { this._haschanges = val; }

    function event_handler(/*Event Obj*/ e) {
        //e.stopPropagation();
        //console.log("handling paint event");
        if (e.layerX || e.layerX == 0) { // Firefox
            e._x = e.layerX;
            e._y = e.layerY;
        }
        else if (e.offsetX || e.offsetX == 0) { // Opera
            e._x = e.offsetX;
            e._y = e.offsetY;
        }

        var toolFunctionCall = e.type;

        e.preventDefault();
        
        /*if(e.type === 'mouseout') {
        console.log('mouseout');
        toolFunctionCall = 'mouseup';
        }*/

        if (toolFunctionCall == 'mousedown')
            {self.setHasChanges(true);}

        /* Handlers for touch events */
        if (toolFunctionCall == "touchstart") {
            self.toolbox.tool.touchstart(e);
        }

        if (toolFunctionCall == "touchmove") {
            self.toolbox.tool.touchmove(e);
        }

        if (toolFunctionCall == "touchend") {
            self.toolbox.tool.touchend(e);
        }

        /* Handlers for mouse events */
        if (toolFunctionCall == "mousedown") {
            self.toolbox.tool.mousedown(e);
        }

        if (toolFunctionCall == "mousemove") {
            self.toolbox.tool.mousemove(e);
        }

        if (toolFunctionCall == "mouseup") {
            self.toolbox.tool.mouseup(e);
        }

    }

    var self = this.self = this;
}

Paint.prototype.hasChanges = function () {
    return this._haschanges;
};


Paint.prototype.loadImg = function (png) {
    //console.log(arguments.callee.caller);
    //console.log(this);
    this.clearAllCanvases();
    this.InitImgLoader.loadPNG(png);
    this.setHasChanges(false);
	this.loadingBars.css('display', 'none');
};

Paint.prototype.clearAllCanvases = function () {
    this.InitImgLoader.clearCanvas();
    this.DeltaImgLoader.clearCanvas();
};

Paint.prototype.getDelta = function () {
    //console.log("What is the return of getDelta");
    //console.log(this.DeltaImgLoader.getPNG());
    return this.DeltaImgLoader.getPNG();
};

Paint.prototype.mergeImg = function (png1, png2, clearMerge) {
	this.MergeImgLoader.loadPNG(png1);
	this.MergeImgLoader.loadPNG(png2);
	alert("Image Merging Successful!");
	var mergedPNG = this.MergeImgLoader.getPNG();
	if(clearMerge === true) {this.MergeImgLoader.clearCanvas();}
	return mergedPNG;
};

Paint.prototype.saveImg = function (/*HTML img tag*/ img) {
    var png1 = this.InitImgLoader.getPNG();
    var png2 = this.DeltaImgLoader.getPNG();
    var res_png = this.mergeImg(png1, png2);
    img.src = res_png;
    img.onload = function () { alert("ready for download"); }
};

Paint.prototype.mergeArrImgs = function (arrpngs, plzClear) {
    for (var i = 0; i < arrpngs.length; i++) {
        this.MergeImgLoader.loadPNG(arrpngs[i]);
    }
    alert("Image Merging Successful!");

    var mergedPNG = this.MergeImgLoader.getPNG();
    if (plzClear) { this.MergeImgLoader.clearCanvas(); }
    return mergedPNG;
};
