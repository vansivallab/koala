var $show = $("#show");
var $hide = $("#hide");
var $toolbar = $("#toolbar");
var $oldBrush = $('#pencil');
var preview = document.getElementById("littleCanvas");
var ctx = preview.getContext("2d");
var previewColor = "rgb(163,73,164)";
var previewWidth = 5;
var previewOpacity = 0.8;

var paint = new Paint("mainCanvas", "imageDelta");
paint.toolbox.setWidth(20);
paint.toolbox.setOpacity(.8);
paint.toolbox.setColor("rgb(163,73,164)");
paint.toolbox.setMode("pencil");

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
drawPreview();

/* Set color. */
$(".color").on("click touchstart", function(){
    var color = $(this);
    $('.current').removeClass('current');
    $(this).addClass('current');
    previewColor = $(this).attr("value");
    drawPreview();
    paint.toolbox.setColor(previewColor);
    
});


//login page



//select canvas

