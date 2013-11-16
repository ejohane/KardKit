function LobbyCommunication(){
	var Room = require('./room.js');;
	var Player = require('./player.js');;
	
	this.rooms = [];

	this.init();

	this.lobbyRoom = this.rooms[0];
	this.players = {};
};

LobbyCommunication.prototype.init = function(){
	var R = require('./room.js');
	var theLobby = new R("lobby", "lobby");
	this.rooms[0] = theLobby;
	this.Room = R;
	this.Player = require('./player.js'); 

};

/********************************************************************
    Function: check that player name is neither blank or already used 
	Return Value: true if valid; false otherwise
	Created By: Erik Johansson		On: 10/16/2013
	Updated:
*********************************************************************/
LobbyCommunication.prototype.checkValidPlayer = function(playerName){
  	if (playerName == "") return false;
    for (var i in this.players){
        if(this.players[i].name == playerName){
            return false;
        }
    }
   	return true;
};

/********************************************************************
    Function: creates a player and adds it to the list of players 
    Return Value: returns the player object
    Created By: Erik Johansson      On: 10/16/2013
    Updated:
*********************************************************************/
LobbyCommunication.prototype.createPlayer = function(playerName, clientID){
	var Player = this.Player;
    var player = new Player(playerName, clientID);
    player.status = "Ready";
    this.players[clientID] = player;
    return player;   
};

/********************************************************************
    Function: adds player to the lobby
	Return Value: true if successful; false otherwise
	Created By: Erik Johansson		On: 10/16/2013
	Updated:
*********************************************************************/
LobbyCommunication.prototype.addPlayerToLobby = function(player){
    if (player == null) return false;
    var room = this.rooms[0];
    if (room.getPerson(player.id) != null) return false;
    room.addPerson(player);
    return true;
}; 

/********************************************************************
    Function: creates the table html for the player list
	Return Value: returns a string of HTML representing the player list table
	Created By: Erik Johansson		On: 10/16/2013
	Updated:
*********************************************************************/
LobbyCommunication.prototype.getPlayerListHTML = function(){
    var table = "<thead> <tr> <th> Name </th> <th> Status </th> <th> Game" + " </th> </tr> </thead> ";
    for(var k in this.players){
        var player = this.players[k];
        table = table + "<tr><td>" + player.name +" </td><td>";
        
        var col = "black";
        if(player.status == "Ready"){
            col = "green";
        }else if(player.status == "Busy" || player.status == "In-Game"){
            col = "red";
        }
        table += "<font color=\"" + col + "\"> " + player.status + "</font></td>" ;

        if(player.inGame){
            table += "<td> " + player.room.name + "</td></tr>";
        }else{
            table += "<td> </td></tr>";
        }
    }
    return table;
};

/********************************************************************
    Function: creates the table html for the player list in the create game module
	Return Value: returns a string of HTML representing the player list table
	Created By: Erik Johansson		On: 10/16/2013
	Updated:
*********************************************************************/
LobbyCommunication.prototype.getCreatePlayerListHTML = function(){
    var table = "<thead> <tr> <th> Name </th> <th>Invite</th></tr> </thead> "; 
    var availablePlayers = [];
    for (var k in this.players){
        var player = this.players[k];
        if(player.status == "Ready"){
            availablePlayers.push(player);
        }
    }  
    
    for (var p in availablePlayers){
        table += "<tr><td>" + availablePlayers[p].name +"</td>";
        table += "<td><input type=\"checkbox\" id=\""+ availablePlayers[p].name +"-check\"></td></tr>";
    }
    return table;  
};

/********************************************************************
    Function: checks if the gamename is valid
	Return Value: true, false
	Created By: Erik Johansson		On: 10/16/2013
	Updated:
*********************************************************************/
LobbyCommunication.prototype.validateGame = function(gameName){
	var valid = true;
    for(var k in this.rooms){
    	if(gameName == this.rooms[k].name){
            return false;
        }else if(gameName == ""){
                return false;
        }
    }
    return valid;
 };

/********************************************************************
    Function: creates a game room. The GameRoom contains all the game information.
	Return Value: the room object
	Created By: Erik Johansson		On: 10/16/2013
	Updated:
*********************************************************************/
LobbyCommunication.prototype.createGame = function(gameName, password, invitedPlayers, hostID){
	var host = this.players[hostID];
	//var room = createGame(host, gameName, password, invitedPlayers);
	var Room = this.Room;
    var room = new Room(gameName, host.name, host);
    room.password = password;
    room.addPerson(host);
    room.invited = invitedPlayers;
    this.rooms.push(room);

    host.room   = room;
    host.inGame = true;
    host.status = "In-Game";
    return room;
            client.join(room.name);
            
            var invitedGameName = gameName + "_Invited";
            var invitedRoom = createInviteeRoom(invitedPlayers, invitedGameName, players[client.id]);
            socket.sockets.in(invitedGameName).emit('playerInvited', players[client.id].name +" has invited you to play a game!");
            client.emit('moveToGame');
 };

/********************************************************************
    Function: creates a room of invited playeres to a certain game. 
    			The invited room keeps a list of all invited players. This invited room makes it easier
        		to emit to all invited players
	Return Value: the room object
	Created By: Erik Johansson		On: 10/16/2013
	Updated:
*********************************************************************/
LobbyCommunication.prototype.createInviteeRoom = function(invitedPlayers, gameName, host){
	var Room = this.Room;
    var room = new Room(gameName, host.id, host);
    for (var i in invitedPlayers){
        var player = this.getPlayer(invitedPlayers[i]);
        room.invited.push(player);
        player.invitedGame = gameName; 
    }
    this.rooms.push(room);
    return room;
};

/********************************************************************
    Function: gets the player class based on the player name
	Return Value: the player
	Created By: Erik Johansson		On: 10/16/2013
	Updated:
*********************************************************************/
LobbyCommunication.prototype.getPlayer = function(playerName){
    var player = null;
    for (var k in this.players){
        if(playerName == this.players[k].name){
            player = this.players[k];
        }
    }
    return player;
};

/********************************************************************
    Function: This function is used for inviteRooms. It checks if it is empty, and deletes it if it is. 
	Return Value: true: empty, otherwise false
	Created By: Erik Johansson		On: 10/30/2013
	Updated:
*********************************************************************/
LobbyCommunication.prototype.checkEmptyInviteRoom = function(roomName){
    var room = this.getRoom(roomName);
    if(room.invited.length == 0){
        this.rooms.splice(room, 1);
        return true;
    }
    return false;
};


/********************************************************************
    Function: This function adds a player to the game room.
	Return Value: true: the room
	Created By: Erik Johansson		On: 10/30/2013
	Updated:
*********************************************************************/
LobbyCommunication.prototype.addPlayerToGame = function(gameName, player){
    var room = this.getRoom((player.invitedGame).replace("_Invited", ""));
    if(room != null){
    	room.addPerson(player);
    	player.room = room;
    	player.inGame = true;
    	player.status = "In-Game";	
    }
    return room;
};

/********************************************************************
    Function: This function gets a room based on the name.
	Return Value: the room
	Created By: Erik Johansson		On: 10/30/2013
	Updated:
*********************************************************************/
LobbyCommunication.prototype.getRoom = function(roomName){
    var room = -1;
    for (var i in rooms){
        if(roomName == rooms[i].name){
            room = i;
        }
    }
    return room;
}

module.exports = LobbyCommunication;