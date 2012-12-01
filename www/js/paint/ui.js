var paint = new Paint("imageDelta", "imageTmp");
paint.toolbox.setWidth(5);
paint.toolbox.setOpacity(.8);
paint.toolbox.setColor("rgb(163,73,164)");
paint.toolbox.setMode("rectangle");


var $show = $("#show");
var $hide = $("#hide");
var $toolbar = $("#toolbar");
var $oldBrush = $('#pencil');
var preview = document.getElementById("littleCanvas");
var ctx = preview.getContext("2d");
var previewColor = "rgb(163,73,164)";
var previewWidth = 5;
var previewOpacity = 0.8;

/*resets needed */
$show.css('display', "block");


$show.on('click touchstart', function() {
	$show.css('display', "none");
    $hide.css('display', "block");
    $toolbar.stop().animate({
        right: 0
    }, 400);
	
});

$hide.on('click touchstart', function() {
	$show.css('display', "block");
	$hide.css('display', "none");
    $toolbar.stop().animate({
        right:'-200px'
    });
	
});

/* select tool */
$('.brush').on('click touchstart', function() {
	$oldBrush.removeClass('selected');
	$(this).addClass('selected');
	paint.toolbox.setMode($(this).attr('id'));
	$oldBrush = $(this);
});
    
/* refresh preview image */
function drawPreview() {
    ctx.clearRect(0,0, preview.width, preview.height);
    ctx.fillStyle = previewColor;
    ctx.globalAlpha = previewOpacity;
    ctx.beginPath();
    ctx.arc(preview.width/2,preview.height/2,previewWidth/2,0,2*Math.PI);
    ctx.fill();
};    

/* Set color. */
$(".color").on("click touchstart", function(){
    var color = $(this);
    $('.current').removeClass('current');
    $(this).addClass('current');
    previewColor = $(this).attr("value");
    drawPreview();
    paint.toolbox.setColor(previewColor);
    
});

/* This uses slider library to set with/opacity values. */
document.getElementById("width").onchange = function() {
    previewWidth = this.value;
    drawPreview();
    paint.toolbox.setWidth(previewWidth); //number between 1 and 20
};
document.getElementById("width").onchange();

document.getElementById("opacity").onchange = function() {
    previewOpacity = this.value;
    drawPreview();
    paint.toolbox.setOpacity(previewOpacity); //number between 0 and 1
};
document.getElementById("opacity").onchange();

    


