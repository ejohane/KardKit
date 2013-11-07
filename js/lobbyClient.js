

var socket = io.connect('142.4.210.12:8127');
var validPlayer = "inprogress";
var playerName = "BOB";
/*This function updates the table list of players on home.html */
function updateUserListTable(players){
    $('#playerTable').children().remove();
    var tableHTML = "<thead><tr> <th>#</th><th>Player Name</th><th>Status</th><th>Invite</th></tr></thead>";
    var i = 0
    for (var key in players){
        tableHTML = tableHTML + "<tr><td>"+i+"</td><td>"+players[key].name+"</td><td>Waiting</td><td><input type=\"checkbox\" id=\"check"+players[key]+"\"></td></tr>";
        i++;
    }
    $('#playerTable').append(tableHTML);
}

function updateUserBar(){
	$('#gameCreateMenu').children().remove();
	var html ="<table class=\"table table-condensed\"> <tr> <th><h4>Username: Erik</h4></th> <th>  <div class=\"btn-group\"> <button type=\"button\" class=\"btn btn-danger dropdown-toggle\" data-toggle=\"dropdown\" id=\"status\"> Waiting <span class=\"caret\"></span> </button> <ul class=\"dropdown-menu\" role=\"menu\"> <li><a href=\"#\" id=\"statusWait\">Waiting</a></li> <li><a href=\"#\" id=\"statusReady\">Ready</a></li> </ul> </div> </th> <th><center> <button type=\"button\" class=\"btn btn-primary btn-lg\" id=\"createGame\">Create Game</button></center></th> </tr> </table>"
	$('#gameCreateMenu').html(html);       
}




$(document).ready(function() {
    socket.emit('drawCurrentPlayers');

    //---Hide main page and ask for username
    $('.LobbyPage').hide();
    $('#myModal').modal("show");

    $('#myTab a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    });


    //---Status Selection Functionality
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
        socket.emit('validatePlayer', playerName);
        if($("#username").val() == ""){
            $("#createUser").popover('show');
        }
    });
    socket.on('checkValidPlayer', function(valid){
        validPlayer = valid;
        if (!(validPlayer)){
            $("#createUser").popover('show');  
        }else{
            socket.emit("addPlayer", playerName);
        }
    });

    socket.on('succesfullyJoined', function(){
        $('#usernameTitle').append("<h3>Player: "+playerName+"</h3>");
        $('.LobbyPage').show();
        $('#myModal').modal("hide");
    });


    socket.on('updatePlayerList', function(tableHTML){
        $('#playerListTable').children().remove();
        $('#playerListTable').append(tableHTML);
    });


    //------ Creating Games ------
    $("#launchGame").click(function(){
        var game = $("#gameName").val();
        var players = getInvitedPlayers();
        var password = $("#password").val();

        socket.emit("validateGame", game, password, players);
    });
    $("#createGame").click(function(){
        socket.emit("getCreateGamePlayerListHTML");
        $('#createGameModal').modal("show");
    });
    socket.on('updatePlayerListGameRoom', function(tableHTML){
        var userInfo = "<tr><td>" + playerName +"</td><td><input type=\"checkbox\" id=\""+ playerName +"-check\"></td></tr>";
        tableHTML = tableHTML.replace(userInfo, "");
        $('#creatingGamePList').children().remove();
        $('#creatingGamePList').append(tableHTML);
    });
    socket.on('invalidGameCreation', function(message){
        alert(message);
    });

    socket.on("playerInvited", function(message){
        $('#playerInvitedMsg').append(message);
        $('#playerInvited').modal("show");
    });


    /* JOINING GAME IF CLIENT CREATED */
    socket.on("moveToGame", function(){
        window.open("/gameRoom.html", "_blank");
    });
    /* JOINING GAME IF ASKED TO JOIN */
    $('#joinGameBtn').click(function(){
        socket.emit('joinGame');
        window.open("/gameRoom.html", "_blank");
    });


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