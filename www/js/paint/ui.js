var selectedBrush = "pencil";
document.getElementById("show").style.display = "block";

/* select tool */
function select(node) {
    //remove selected
    var old = document.getElementById(selectedBrush);
    old.className="brush";
    node.className = "selected brush";
    selectedBrush = node.id;
    paint.toolbox.setMode(selectedBrush);
    
    
}


/*showHide */
function showHide(node) {
    var show = document.getElementById("show");
    var hide = document.getElementById("hide");
    var toolbar = document.getElementById("toolbar");
    
    if(node.id == 'show') {
        show.style.display = 'none';
        hide.style.display = 'block';
        toolbar.style.display = 'block';
        
    } else if(node.id == 'hide') {
        show.style.display = 'block';
        hide.style.display = 'none';
        toolbar.style.display = 'none';
    
    }
}    
    
    

