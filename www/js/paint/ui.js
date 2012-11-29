var paint = new Paint("imageDelta", "imageTmp");
paint.toolbox.setColor('black');
paint.toolbox.setWidth(5);
paint.toolbox.setOpacity(1);
paint.toolbox.setColor("black");

paint.toolbox.setMode("pencil");


var $show = $("#show");
var $hide = $("#hide");
var $toolbar = $("#toolbar");
var $oldBrush = $('#pencil');

/*resets needed */
$("#showHide").css('background', "#7080D7");
$show.css('display', "block");


$show.on('click touchstart', function() {
	$show.css('display', "none");
    $hide.css('display', "block");
    $toolbar.css('display', "block");
	
});

$hide.on('click touchstart', function() {
	$show.css('display', "block");
	$hide.css('display', "none");
	$toolbar.css('display', "none");
	
});

/* select tool */
$('.brush').on('click touchstart', function() {
	$oldBrush.removeClass('selected');
	$(this).addClass('selected');
	paint.toolbox.setMode($(this).attr('id'));
	$oldBrush = $(this);
});
    
    


