var Room = require('./room.js');
var Player = require('./player.js');
var players = {};
var rooms = [];

//create lobby, the lobby is ALWAYS held at the first index in rooms
var lobbyRoom = new Room("lobby", "lobby");
rooms[0] = lobbyRoom;

/********************************************************************
    Function: check that player name is neither blank or already used 
	Return Value: true if valid; false otherwise
	Created By: Erik Johansson		On: 10/16/2013
	Updated:
*********************************************************************/
exports.checkValidPlayer = function checkValidPlayer(playerName){
  	if (playerName == "") return false;
    for (var i in players){
        if(players[i].name == playerName){
            return false;
        }
    }
   	return true;
}

/********************************************************************
    Function: check that player name is neither blank or already used 
    Return Value: true if valid; false otherwise
    Created By: Erik Johansson      On: 10/16/2013
    Updated:
*********************************************************************/
exports.createPlayer = function createPlayer(playerName, clientID){

    var player = new Player(playerName, clientID);
    player.status = "Ready";
    players[clientID] = player;
    
    console.log(players[clientID].name);
    console.log("******** Player (" + player.name + ") with id: (" + player.id + ") has connected. ********");

    if(addPlayerToLobby(player))
        return true;
    else
        return false;    
}


function addPlayerToLobby(player){

    if (player == null){
        console.log("Invalid player name, cannot add player to lobby");
        return false;
    }

    var room = rooms[0];
    
    if (room.getPerson(player.id) != null){
        console.log("Player "+ player.name +" already exists in the lobby");
        return false;
    }

    room.addPerson(player);
    
    console.log("Player "+player.name+" joined the lobby");
    console.log("People in Lobby: ");
    for(var i = 0; i < room.people.length; i++){
        console.log("   " + room.people[i].name); 
    }
        
    //client.join(room);
    //socket.sockets.in(rooms[0]).emit('updatePlayerList',getPlayerListHTML());
    //socket.sockets.in(rooms[0]).emit('updatePlayerListGameRoom', getCreatePlayerListHTML());
    return true;
}  


/********************************************************************
	Function: get size of any object 
	Return Value: the size of the object
	Created By: Erik Johansson		On: 10/16/2013
	Updated:
*********************************************************************/
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};




/*        if (checkValidPlayer(playerName)){
            var player = new Player(playerName, client.id);
            player.status = "Ready";
            players[client.id] = player;
            console.log(players[client.id].name);
            console.log("******** Player (" + player.name + ") with id: (" + player.id + ") has connected. ********");
            console.log("******** Number of Players: "+Object.size(players)+"********");
            addPlayerToLobby(player);
            client.emit("succesfullyJoined");

        }else{
            console.log("player (" + player +") already exists!! or invalid player name");
        }*/






