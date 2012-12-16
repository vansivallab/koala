// vim: set et ts=4 sts=4 sw=4:

var connectionKey = "";

//main.js
window.onload = function() {
	window.util.patchFnBind();
	document.body.addEventListener('touchmove', function(e){ e.preventDefault(); });
	
	var mainCanvasDLib = new DrawingLib(document.getElementById("mainCanvas"));
	var deltaCanvasDLib = new DrawingLib(document.getElementById("imageDelta"));
	window.mainCanvasDLib = mainCanvasDLib;
	window.deltaCanvasDLib = deltaCanvasDLib;
	
	window.socket = newSocket('http://128.237.236.75:3000/', mainCanvasDLib);
	
    
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
    $('#logout').on('click touchleave', function() {
        window.socket.e.logout();
        $('#selectionElements').empty();
        
        window.util.navigateTo('#login');
    });

    //invite friends
    $('#inviteFriend').on('click touchstart', function() {
        var friend = $('#friend').val();
        var msg = "";
        if(($.trim(friend).length == 0) || (window.util.isValidEmail(friend) == false)) {
			msg = "Invalid Email Address <br />";
            $('#errorInvite').html(msg);
            $('#friend').val("");
		}
        
        if(msg == "") {            
            $('#errorInvite').html("");
            window.socket.e.inviteUser(friend);
            console.log("sent invite");
            
        }
        
    });
    
	// select canvas
	$('#canvasSelection').children('#selectionElements').on('click'+window.util.getTapEvent(), '.selectionElement',  function() {
		window.socket.e.selectCanvas($(this).attr('id'));
	});

	// add new canvas
	$('#addButton').on('click'+window.util.getTapEvent(), function() {      
        window.socket.e.createCanvas();
		
	});
};


//client code

