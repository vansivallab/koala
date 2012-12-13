// vim: set et ts=4 sts=4 sw=4:

var connectionKey = "";

//main.js
window.onload = function() {
	window.util.patchFnBind();
	
	var mainCanvasDLib = new DrawingLib(document.getElementById("mainCanvas"));
	var deltaCanvasDLib = new DrawingLib(document.getElementById("imageDelta"));
	window.mainCanvasDLib = mainCanvasDLib;
	window.deltaCanvasDLib = deltaCanvasDLib;
	
	window.socket = newSocket('http://128.237.112.53:3000/', mainCanvasDLib);	
	
	//login 
	var loginForm = document.getElementById('loginForm');

	// Attaching the submit event to the form.
	// Different browsers do it differently so we include both ways below (grr IE)
	if (loginForm.attachEvent) {
		loginForm.attachEvent("submit", submitForm);
	} else {
		loginForm.addEventListener("submit", submitForm);
	}

	function submitForm() {
		var email = $('#email').val();
		var password = $('#password').val();
		var msg = "";
		
		if(($.trim(email).length == 0) || (window.util.isValidEmail(email) == false)) {
			msg = msg + "Invalid Email Address <br />";   
		}
		if(($.trim(password).length == 0) || (window.util.isValidInput(password) == false)) {
			msg = msg + "Invalid Password <br />";
		}
		
		if(msg == "") {
			window.socket.e.login(email, password);
			$('#error').html("");
		}
		else {
			$('#error').html(msg);
			
		}
	}
	
	//populate canvas ids on canvas selection screen
	function loadCanvasElementMarkup(filePath) {
		return "<div class='selectionElement' id='"
			+ filePath +"'> " 
			+ "<div class='text'>"+ filePath
			+ "</div>"
		+ "</div>";
	};

	// select canvas
	$('#canvasSelection').children('#selectionElements').on('click', '.selectionElement',  function() {
		window.socket.e.selectCanvas($(this).attr('id'));
	});

	// add new canvas
	$('#addButton').on('click', function() {
		var name = $('#newFile').val();
		var msg = "";
		if(($.trim(name).length == 0) || (window.util.isValidInput(name) == false)) {
			msg = msg + "Invalid Canvas Name <br />";   
		}
		
		$('#errorCanvas').html(msg);
		if(msg == "") {

			var data = {
				connectionKey: connectionKey,
				canvasId: name
			}
			
			window.socket.e.createCanvas();
			
		}

		
	});
};


//client code

