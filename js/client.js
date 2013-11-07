var socket = io.connect('127.0.0.1:3000');
var validPlayer = "inprogress";

$(document).ready(function() {
	updateUserListTable();	
	
	function checkValidPlayer(){
		if($("#username").val() == ""){
            return false;
        }else{
        	socket.on()
        }
	}

	//Return signal for checking if player has a valid name. 
	socket.on("checkValidPlayer", function(valid){
		validPlayer = valid;
	});

	$('#joinBtn').click(function(){
		var player = $("#username").val();
		socket.emit("addPlayer", player);
	});

	socket.on("succesfullyJoined", function(){
		$('#joinForm').hide();
		updateUserBar();
	});


    $("#goBtn").click(function(){
    	socket.emit('validatePlayer');

	    if($("#username").val() == ""){
    	    $("#wrongModal").modal("show");
        }else{
        	var count = 0;
        	while (validPlayer != "inprogress"){
        		count ++;
        		if (count == 50000){
        			//error connection timeout
        	}
        	if (validPlayer) window.location.href='./lobby.html';   
        }
    });

});