function LobbyCommunication(){
	var Room = require('./room.js');;
	var Player = require('./player.js');;
	
	this.rooms = [];
	this.invitedRooms = [];

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
    for(var k in this.rooms){
    	if(gameName == this.rooms[k].name){
            return false;
        }else if(gameName == ""){
            return false;
        }
    }
    return true;
 };

/********************************************************************
    Function: creates a game room. The GameRoom contains all the game information.
	Return Value: the room object
	Created By: Erik Johansson		On: 10/16/2013
	Updated:
*********************************************************************/
LobbyCommunication.prototype.createGame = function(gameName, password, invitedPlayers, hostID, playerLimit){
	var host = this.players[hostID];
	//var room = createGame(host, gameName, password, invitedPlayers);
	var Room = this.Room;
    var room = new Room(gameName, host.name, host);
    room.password = password;
    room.peopleLimit = playerLimit;
    room.addPerson(host);
    room.invited = invitedPlayers;
    this.rooms.push(room);

    host.room   = room;
    host.inGame = true;
    host.status = "In-Game";
    return room;
 };

/********************************************************************
    Function: creates a room of invited playeres to a certain game. 
    			The invited room keeps a list of all invited players. This invited room makes it easier
        		to emit to all invited players
	Return Value: the room object
	Created By: Erik Johansson		On: 10/16/2013
	Updated:
*********************************************************************/
LobbyCommunication.prototype.createInviteeRoom = function(invitedPlayers, gameName, host,password){
	var Room = this.Room;
    var room = new Room(gameName, host.id, host);
    room.password = password;
    for (var i in invitedPlayers){
        var player = this.getPlayer(invitedPlayers[i]);
        if(player.name != host.name){
        	room.invited.push(player);
        	player.invitedGame = gameName; 
        }
    }
    this.invitedRooms.push(room);
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
    var room = this.getRoom(roomName, "inviteRoom");
    if(room != null && room.invited.length == 0 ){
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
    var room = this.getRoom(player.invitedGame.replace("_Invited", ""), "gameRoom");
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
	Return Value: the room index
	Parameters: roomName: the name of the room
				type: "inviteRoom" or "gameRoom" 
	Created By: Erik Johansson		On: 10/30/2013
	Updated:
*********************************************************************/
LobbyCommunication.prototype.getRoom = function(roomName, type){
    var room = null;
    if(type == "inviteRoom" && this.invitedRooms == null ){
    	for (var i in this.invitedRooms){
        	if(roomName == this.invitedRooms[i].name){
            	room = this.invitedRooms[i];
        	}
    	}
    }else if(type == "gameRoom"){
		for (var i in this.rooms){
        	if(roomName == this.rooms[i].name){
            	room = this.rooms[i];
        	}
    	}
    }
    return room;
};


/********************************************************************
    Function: creates the table html for the player list
	Return Value: returns a string of HTML representing the player list table
	Created By: Erik Johansson		On: 10/16/2013
	Updated:
*********************************************************************/
LobbyCommunication.prototype.getGameRoomList = function(){
    var table = "<thead> <tr> <th> Room </th> <th> Players </th> <th> Status </th> <th> Join </th> </tr> </thead> ";

    //assumes a lobby has already been created and is held at rooms[0]
    for(var i = 1; i < this.rooms.length; i++){
    	var room = this.rooms[i];
        table = table + "<tr><td>" + room.name +" </td>";
        table += "<td> " +room.people.length + " / " + room.peopleLimit +"</td>" ;
        
        var col = "black";
        if(room.status == "Open"){
            col = "green";
        }else if(room.status == "Closed"){
            col = "red";
        }
        table += "<td><font color=\"" + col + "\"> " + room.status + "</font></td>" ;

        var joinID = "join_" + room.name;
        table += "<td> <button type=\"button\" class=\"btn btn-primary btn-sm join-from-gameList\" id=\"" + joinID + "\" >Join</button> </td>	</tr>"
    }
    return table;
};


/********************************************************************
    Function: Player has been disconnected, remove them from everything.
    Return Value: 
    Created By: Erik Johansson      On: 11/25/2013
    Updated:
*********************************************************************/
LobbyCommunication.prototype.playerDisconnected = function(playerID){
    var player = this.players[playerID];
    console.log("PlayerName: "+player.name);
    //remove player from room
    var room = player.room;
    if(room != undefined){
        var index = room.people.indexOf(player);
        if(index > -1) room.people.splice(index, 1);  
    } 

    //remove player from invitedRooms
    room = player.invitedGame;
    if(room != undefined){
        index = room.people.indexOf(player);
        if(index > -1) room.people.splice(index, 1);
    }

    //remove player from lobby
    index = this.lobbyRoom.people.indexOf(player);
    if(index > -1) this.lobbyRoom.people.splice(index,1);

    //remove player
    //index = this.players.indexOf(playerID);
    //if(index > -1) this.players.splice(index,1);
    delete this.players[playerID];
};


module.exports = LobbyCommunication;