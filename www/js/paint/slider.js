//slider.js            
var startY;           
var offsetY;
var dragElement;           
var oldZIndex = 0;
var min = 0;
var max = 200;         
var maxWidth = 40;

function OnMouseDown(e)
{
    if (e == null) 
        e = window.event; 
    
    // IE uses srcElement, others use target
    var target = e.target != null ? e.target : e.srcElement;
   

    // get left click
    if ((e.button == 1 && window.event != null || 
        e.button == 0) && 
        target.className == 'drag')
    {
        // grab the mouse position
        startY = e.clientY;
        
        // grab the clicked element's position
        offsetY = ExtractNumber(target.style.top);
        
        // bring the clicked element to the front while it is being dragged
        oldZIndex = target.style.zIndex;
        target.style.zIndex = 10000;
        
        // we need to access the element in OnMove
        dragElement = target;

        // tell our code to start moving the element with the mouse
        document.onmousemove = OnMouseMove;
        
        // cancel out any text selections
        document.body.focus();

       
        // prevent text selection (except IE)
        return false;
    }
}


function OnTouchStart(e)
{
    if (e == null) 
        e = window.event; 
    
    // IE uses srcElement, others use target
    var target = e.target != null ? e.target : e.srcElement;
   
    if (target.className == 'drag')
    {
        // grab the tap position
        startY = e.changedTouches[0].pageY;
        
        // grab the tapped element's position
        offsetY = ExtractNumber(target.style.top);
        
        // bring the tapped element to the front while it is being dragged
        oldZIndex = target.style.zIndex;
        target.style.zIndex = 10000;
        
        // we need to access the element in OnMove
        dragElement = target;

        // tell our code to start moving the element with the mouse
        document.ontouchmove = OnTouchMove;
        
        // cancel out any text selections
        document.body.focus();

       
        // prevent text selection (except IE)
        return false;
    }
}

function OnMouseMove(e)
{
    if (e == null) 
        var e = window.event;         
    
    var positionY = (offsetY + e.clientY - startY);
    if((positionY >= min) && (positionY <= max)) {
        dragElement.style.top =  positionY + 'px';    
        
        if(dragElement.id == 'width') {
            //set width value 
            var fixRange = (max/maxWidth) - 1; //4
            var width = maxWidth * ( (fixRange + positionY) /max );
            dragElement.value = Math.floor(width);
            previewWidth = dragElement.value;
            drawPreview();
            paint.toolbox.setWidth(previewWidth);

        }
        else if(dragElement.id == 'opacity') {
            //set opacity value
            var opacity = 100 * ( (1 + positionY) /max ); 
            dragElement.value = (Math.floor(opacity)/100);
            previewOpacity = dragElement.value;
            drawPreview();
            paint.toolbox.setOpacity(previewOpacity);

        }
         
    }
}


function OnTouchMove(e)
{
    if (e == null) 
        var e = window.event;         
    
    var positionY = (offsetY + e.changedTouches[0].pageY - startY);
    if((positionY >= min) && (positionY <= max)) {
        dragElement.style.top =  positionY + 'px';    
        
        if(dragElement.id == 'width') {
            //set width value 
            var fixRange = (max/maxWidth) - 1; //4
            var width = maxWidth * ( (fixRange + positionY) /max );
            dragElement.value = Math.floor(width);
            previewWidth = dragElement.value;
            drawPreview();
            paint.toolbox.setWidth(previewWidth);

        }
        else if(dragElement.id == 'opacity') {
            //set opacity value
            var opacity = 100 * ( (1 + positionY) /max ); 
            dragElement.value = (Math.floor(opacity)/100);
            previewOpacity = dragElement.value;
            drawPreview();
            paint.toolbox.setOpacity(previewOpacity);

        }
         
    }
}


function OnMouseUp(e)
{
    if (dragElement != null)
    {
        dragElement.style.zIndex = oldZIndex;

        // we're done with these events until the next OnMouseDown
        document.onmousemove = null;
        document.onselectstart = null;

        // this is how we know we're not dragging      
        dragElement = null;
     
    }
}


function OnTouchEnd(e)
{
    if (dragElement != null)
    {
        dragElement.style.zIndex = oldZIndex;

        // we're done with these events until the next OnMouseDown
        document.ontouchmove = null;
        document.ontouchstart = null;

        // this is how we know we're not dragging      
        dragElement = null;
     
    }
}

function ExtractNumber(value)
{
    var n = parseInt(value);
	
    return n == null || isNaN(n) ? 0 : n;
}

function InitDragDrop()
{
    document.onmousedown = OnMouseDown;
    document.onmouseup = OnMouseUp;
    
    
    //mobile
    subTools.addEventListener('touchstart', OnTouchStart);
    subTools.addEventListener('touchmove', OnTouchMove);
    subTools.addEventListener('touchend', OnTouchEnd);
    
    
    document.ontouchstart = OnTouchStart;
    document.ontouchend = OnTouchEnd;
    
    $('#width').css('top', '21px');
    $('#opacity').css('top', '160px');
}
InitDragDrop();
