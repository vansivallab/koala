// vim: set et ts=4 sts=4 sw=4:

var connectionKey = "";

//main.js
window.onload = function() {
	window.util.patchFnBind();
	
	var mainCanvasDLib = new DrawingLib(document.getElementById("mainCanvas"));
	var deltaCanvasDLib = new DrawingLib(document.getElementById("imageDelta"));
	window.mainCanvasDLib = mainCanvasDLib;
	window.deltaCanvasDLib = deltaCanvasDLib;
	
	window.socket = newSocket('http://128.237.205.104:3000/', mainCanvasDLib);	
	
    
    $('#loginForm').submit(submitForm);
    $('#login').on('click touchstart', submitForm);
    
	function submitForm() {
		var email = $('#email').val();
		var password = $('#password').val();
		var msg = "";
		
		if(($.trim(email).length == 0) || (window.util.isValidEmail(email) == false)) {
			msg = msg + "Invalid Email Address <br />";
            $('#email').val("");
		}
		if(($.trim(password).length == 0) || (window.util.isValidInput(password) == false)) {
			msg = msg + "Invalid Password <br />";
            $('#password').val("");
        }
		
		if(msg == "") {
			window.socket.e.login(email, password);
            $('#email').val("");
            $('#password').val("");
			$('#error').html("");
		}
		else {
			$('#error').html(msg);
			
		}
	}
    
    //logout
    $('#logout').on('click touchstart', function() {
        window.socket.e.logout();
        $('#selectionElements').empty();
        
        window.util.navigateTo('#login');
    });

    //invite friends
    $('#inviteFriend').on('click touchstart', function() {
       /*
        var friend = $('#friend').val();
        var msg;
        if(($.trim(friend).length == 0) || (window.util.isValidEmail(friend) == false)) {
			msg = msg + "Invalid Email Address <br />";
            $('#friend').val("");
		}
        //more code
        
        window.util.navigateTo('#canvas'); */
    });
    
	// select canvas
	$('#canvasSelection').children('#selectionElements').on('click touchstart', '.selectionElement',  function() {
		window.socket.e.selectCanvas($(this).attr('id'));
	});

	// add new canvas
	$('#addButton').on('click touchstart', function() {      
        window.socket.e.createCanvas();
		
	});
};


//client code

