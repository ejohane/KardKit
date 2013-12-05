/******************************************************************************************
    Create By: Erik Johansson
    Last Updated: 11/25/2013 
******************************************************************************************/

var socket = io.connect('142.4.210.12:8127');
var validPlayer = "inprogress";
var playerName = "BOB";
var invPassword = "";

$(document).ready(function() {

    //---Hide main page and ask for username
    $('.LobbyPage').hide();
    $('#myModal').modal("show");

    $('#myTab a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    });


    //---Reflect change status for the status button
    $(".dropdown-menu li a").click(function(){
        var selText = $(this).text();
        if (selText == "Busy"){
            $(this).parents('.btn-group').find('.dropdown-toggle').attr("class", "btn btn-danger dropdown-toggle");
        }else{
            $(this).parents('.btn-group').find('.dropdown-toggle').attr("class", "btn btn-success dropdown-toggle");
        }
        $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+'<span class="caret"></span>');
        socket.emit("updateStatus", selText);
    });


   //--- Creates and Adds User
    $('#createUser').click(function(){
        playerName = $('#username').val();
        $.cookie("KardKit-username", playerName);
        socket.emit('validatePlayer', playerName);
        if($("#username").val() == ""){
            $("#createUser").popover('show');
        }
    });

    //--- Show error popup if username is invalid; if not add them to the lobby
    socket.on('checkValidPlayer', function(valid){
        validPlayer = valid;
        if (!(validPlayer)){
            $("#createUser").popover('show');  
        }else{
            socket.emit("addPlayer", playerName);
        }
    });

    //--- Called when user has succesffuly joined the lobby
    socket.on('succesfullyJoined', function(){
        $('#usernameTitle').append(playerName);
        var msg = "Hello "+ playerName + ", welcome to the Kard Kit Lobby! \n";
        addInboxMessage(msg, "confirmation");
        $('.LobbyPage').show();
        $('#myModal').modal("hide");
    });


    //--- Called to updated the list of players
    socket.on('updatePlayerList', function(tableHTML){
        $('#playerListTable').children().remove();
        $('#playerListTable').append(tableHTML);
    });

    //--- Called whenver a player is added to the lobby to update different lists
    socket.on('playerAddedToLobby', function(tableHTML, player){
        $('#playerListTable').children().remove();
        $('#playerListTable').append(tableHTML);
        var msg = player + " has just joined the lobby";
        addInboxMessage(msg, "confirmation");
    });


    //------ Creating Games ------

    //--- Create Game
    $("#launchGame").click(function(){
        var game = $("#gameName").val();
        var players = getInvitedPlayers();
        var password = $("#password").val();

        socket.emit("validateGame", game, password, players);
    });

    //--- Show modal for actually creating game
    $("#createGame").click(function(){
        socket.emit("getCreateGamePlayerListHTML");
        $('#createGameModal').modal("show");
    });

    //-- Called when 
    socket.on('updatePlayerListGameRoom', function(tableHTML){
        var userInfo = "<tr><td>" + playerName +"</td><td><input type=\"checkbox\" id=\""+ playerName +"-check\"></td></tr>";
        tableHTML = tableHTML.replace(userInfo, "");
        $('#creatingGamePList').children().remove();
        $('#creatingGamePList').append(tableHTML);
    });

    //--- alert when invalid game name
    socket.on('invalidGameCreation', function(message){
        alert(message);
    });

    //--- show the player invited message
    socket.on("playerInvited", function(message, password){
        if(password == undefined){
            $('#playerInvitedMsg').append(message);
            $('#playerInvited').modal("show");
        }else{
            invPassword = password;
            $('#playerInvitedMsg-Pswd').append(message);
            $('#playerInvited-Pswd').modal("show");
        }      
    });


    /* JOINING GAME IF CLIENT CREATED */
    socket.on("moveToGame", function(){
        $('#createGameModal').modal("hide");
        window.open("./game.html", "_blank");
        socket.emit('joinGameRoom');
    });
    /* JOINING GAME IF ASKED TO JOIN */
    $('#joinGameBtn').click(function(){
        socket.emit('joinGame');
        $('#playerInvited').modal("hide");
        window.open("/game.html", "_blank");
        socket.emit('joinGameRoom');
    });

    $('#joinGameBtnPwd').click(function(){
        if($('#password-invite').val() == invPassword){
            socket.emit('joinGame');
            $('#playerInvited-Pswd').modal("hide");
            window.open("/gameUI/game.html", "_blank");
        }else{
            alert("Invalid Password");  
        }
    });

    //--updates the list of games
    socket.on("updatedGamesList", function(table){
        $('#gameListTable').children().remove();
        $('#gameListTable').append(table);
    });

    $('.btn btn-primary btn-sm join-from-gameList').click(function(){
       window.open("/gameUI/game.html", "_blank"); 
    });





    /***************************CHAT FUNCTIONALITY*************************************/

    $("#sendMessage").click(function(){
        sendOutboxMessage();
    });
    	
	socket.on("ChatReceiveMessage", function(message){
		addInboxMessage(message, "message");
	});
	
	socket.on("ChatConfirmMessage", function(message){
		addInboxMessage(message, "confirmation");
	});
	
	socket.on("ChatPrivateMessage", function(message){
		addInboxMessage(message, "privateMessage");
	});
    
    function addInboxMessage(message, type){
        var spanElement = document.createElement("span");
        spanElement.innerHTML = message;
        spanElement.className = type;
        $("#chat-inbox").append(spanElement);
        $("#chat-inbox").append(document.createElement("br"));
        $('#chat-inbox').scrollTop = $('#chat-inbox').scrollHeight;
    }

    function sendOutboxMessage() {
        var v = $('#outbox-text').val();
        var outboxMessage = playerName + ": " + v;
        socket.emit("chatSendPublicMessage", outboxMessage);
        $("#outbox-text").val("");
    }

});

function getInvitedPlayers(){
    var players = [];
    var table = document.getElementById('creatingGamePList');
    for(var i = 1, row; row = table.rows[i]; i++){
        var col = row.cells[0];
        var name = col.innerHTML;
        players.push(name);
    }
    var invitedPlayers = [];
    for(var i in players){
        var id = players[i]+"-check";
        if (document.getElementById(id).checked) invitedPlayers.push(players[i]);
    }
    return invitedPlayers;
}



