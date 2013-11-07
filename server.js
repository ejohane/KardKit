

var fs = require('fs');

function getExtension(filePath){
  var extension = filePath.substring(filePath.lastIndexOf("."), filePath.length);
  return extension;
}
//these are the only file types we will support for now
extensions = {
    ".html" : "text/html",
    ".css" : "text/css",
    ".js" : "application/javascript",
    ".png" : "image/png",
    ".gif" : "image/gif",
    ".jpg" : "image/jpeg",
    ".svg" : "image/svg+xml",
    ".ttf" : "text/css",
    ".woff": "text/css"
};

//helper function handles file verification
function getFile(filePath,res,page404,mimeType){
    //does the requested file exist?
    console.log("Requesting: "+filePath);
    fs.exists(filePath,function(exists){
        //if it does...
        if(exists){
            console.log("File Exists");
            //read the fiule, run the anonymous function
            fs.readFile(filePath,function(err,contents){
                if(!err){
                    //if there was no error
                    //send the contents with the default 200/ok header
                    res.writeHead(200,{
                        "Content-type" : mimeType,
                        "Content-Length" : contents.length
                    });
                    res.end(contents);
                } else {
                    //for our own troubleshooting
            
                };
            });
        } else {
            //if the requested file was not found
            //serve-up our custom 404 page
            fs.readFile(page404,function(err,contents){
                //if there was no error
                if(!err){
                    //send the contents with a 404/not found header 
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end(contents);
                } else {
                    //for our own troubleshooting
                    
                };
            });
        };
    });
};

//a helper function to handle HTTP requests
function requestHandler(req, res) {
    console.log("\n -----------------------------");
    console.log("URL Request: " + req.url);
    //fileName = path.basename(req.url) || 'home.html',
    if (req.url == "/") {
      var fileName = '/home.html';
    }else{
      var fileName = req.url;
    }
    var ext = getExtension(fileName);
    var localFolder = ".",
    page404 = localFolder + '/404.html';

    //do we support the requested file type?
    if(!extensions[ext]){
        //for now just send a 404 and a short message
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end("<html><head></head><body>The requested file type is not supported</body></html>");
    };
 
    //call our helper function
    //pass in the path to the file we want,
    //the response object, and the 404 page path
    //in case the requestd file is not found
    getFile((localFolder + fileName),res,page404,extensions[ext]);
};
var http = require('http');
var server = http.createServer(requestHandler).listen(8127, "142.4.210.12");
console.log('Server running at http:142.4.210.12:8127/');
var io = require('socket.io');
var socket = io.listen(server);

var Room = require('./js/room.js');
var Player = require('./js/player.js');
var players = {};
var rooms = [];
var clients = [];

//create lobby
var lobbyRoom = new Room("lobby", "lobby");
rooms[0] = lobbyRoom;




// Get size of an object (used for players object)
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};




    function checkValidPlayer(playerName){
        if (playerName == "") return false;
        for (var i in players){
            if(players[i].name == playerName){
                return false;
            }
        }
        return true;
    }

/************************************************************************************************************************************************
*************************************************************************************************************************************************
****************************************************************Socket Connections **************************************************************
*************************************************************************************************************************************************
************************************************************************************************************************************************/

socket.on('connection', function (client) {

    /*This function adds a player to the lobby page */   
    client.on('addPlayer', function(playerName){
        console.log("adding player -----");
        if (checkValidPlayer(playerName)){
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
        }
    });
    /*Helper function for client.on('addplayer') */
    function addPlayerToLobby(player){
        //var player = players[client.id];
        if (player == null){
            console.log("player is null");
            return;
        }
        var room = rooms[0];
        if (room.getPerson(player.id) != null){
            console.log("Player "+ player.name +" already exists in the lobby");
            return;
        }

        room.addPerson(player);
        console.log("Player "+player.name+" joined the lobby");
        console.log("People in Lobby: ");
        for(var i = 0; i < room.people.length; i++){
           console.log("   " + room.people[i].name); 
        }
        
        client.join(room);
        socket.sockets.in(rooms[0]).emit('updatePlayerList',getPlayerListHTML());
        socket.sockets.in(rooms[0]).emit('updatePlayerListGameRoom', getCreatePlayerListHTML());
    }   

 
    /* Called when user disconnects from server !!!!!!!!!! NOT IMPLEMENTED YET */
    client.on('disconnect', function(){
        console.log("******** Player with id: (" + client.id + ") with name: ("+ players[client.id] +") has disconnected ********");
        delete players[client.id];
        for(var key in players) {
          console.log("******** Remaining players: " + key + ": " + players[key] +"********");
        }     
    });


    /*Checks if username is valid */
    client.on('validatePlayer', function(playerName){
        console.log(playerName + " is HERE");
        var valid = checkValidPlayer(playerName);
        console.log("Valid Player: " + valid);
        client.emit("checkValidPlayer", valid);
    });

    /*Called when user updates their status */
    client.on("updateStatus", function(status){
        console.log(players[client.id].name + " status before = " + status);
        players[client.id].status = status;
        console.log(players[client.id].name + " status after = " + players[client.id].status);
        socket.sockets.in(rooms[0]).emit('updatePlayerList',getPlayerListHTML());
        socket.sockets.in(rooms[0]).emit('updatePlayerListGameRoom', getCreatePlayerListHTML());
    });


    //------ Creating Games ------

    /*Creates the list of available playres for game creation modal */
    client.on("getCreateGamePlayerListHTML", function(){
        var table = getCreatePlayerListHTML();
        socket.sockets.in(rooms[0]).emit('updatePlayerListGameRoom', table);
    });
    
    /*Checks if valid game name, then creates it if true 
        This function will create a GameRoom as well as a InvitedRoom
        The GameRoom contains all the game information, the invited room keeps a list of all invited players. This invited room makes it easier
        to emit to all invited playres */
    client.on("validateGame", function(gameName, password, invitedPlayers){
        var valid = true;
        for(var k in rooms){
            if(gameName == rooms[k].name){
                client.emit('invalidGameCreation', "Game Name Already Exists!");
                valid = false;
                break;
            }else if(gameName == ""){
                client.emit('invalidGameCreation', "Must Have Game Name");
                valid = false;
                break;
            }
        }
        if(valid){

            var room = createGame(players[client.id], gameName, password, invitedPlayers);
            players[client.id].room   = room;
            players[client.id].inGame = true;
            players[client.id].status = "In-Game"
            client.join(room.name);
            
            var invitedGameName = gameName + "_Invited";
            var invitedRoom = createInviteeRoom(invitedPlayers, invitedGameName, players[client.id]);
            socket.sockets.in(invitedGameName).emit('playerInvited', players[client.id].name +" has invited you to play a game!");
            client.emit('moveToGame');
        }
    });
    /*This is a helper function for client.on("validateGame") */
    function createInviteeRoom(invitedPlayers, gameName, host){
        var room = new Room(gameName, host.id, host);
        //add invited players to room.
        for (var i in invitedPlayers){
            var player = getPlayer(invitedPlayers[i]);
            room.invited.push(player);
            player.invitedGame = gameName; 
            socket.sockets.socket(player.id).join(room.name);
        }
        rooms.push(room);
        return room;
    }
    
    /*********************************************************************
    ********************** JOINING GAME FUNCTIONS ************************
    **********************************************************************/

    /*  Created By: Erik Johansson    on: 10/30/2013
        This function is called when a user clicks on join game.
        It adds the player to the game room                     */
    client.on('joinGame', function(){
        console.log("**************HEREHE");
        console.log(players[client.id].invitedGame);
        var player = players[client.id]
        //Remove player from invited room
        client.leave(player.invitedGame);

        //Remove room if empty
        checkEmptyInviteRoom(player.invitedGame);

        //Join Created Room
        var gameName = (player.invitedGame).replace("_Invited", "");
        var room = rooms[getRoom(gameName)];
        room.addPerson(player);
        player.room = room;
        player.inGame = true;
        player.status = "In-Game";
        client.join(room.name);
        
    });


    /*-------------------------------------------
                Game ROOM Functions
        ------------------------------------------- */
    client.on("drawStuff",function(){
        var room = players[client.id].room;

    });
});


/*Helper function for getting player list table html on lobby page */
function getPlayerListHTML(){
    var table = "<thead> <tr> <th> Name </th> <th> Status </th> <th> Game" + " </th> </tr> </thead> ";
    for(var k in players){
        var player = players[k];
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
}

/*Helper function for creating table of available players to create game */
function getCreatePlayerListHTML(){
    var table = "<thead> <tr> <th> Name </th> <th>Invite</th></tr> </thead> "; 
    var availablePlayers = [];
    for (var k in players){
        var player = players[k];
        if(player.status == "Ready"){
            availablePlayers.push(player);
        }
    }  
    
    for (var p in availablePlayers){
        table += "<tr><td>" + availablePlayers[p].name +"</td>";
        table += "<td><input type=\"checkbox\" id=\""+ availablePlayers[p].name +"-check\"></td></tr>";
    }
    return table;  
}


/* Gets the player class based on player name */
function getPlayer(playerName){
    var player = null;
    for (var k in players){
        if(playerName == players[k].name){
            player = players[k];
        }
    }
    return player;
}

function getRoom(roomName){
    var room = -1;
    for (var i in rooms){
        if(roomName == rooms[i].name){
            room = i;
        }
    }
    return room;
}


/*Creates a new game room */
function createGame(host, gameName, password, invitedPlayers){
    var room = new Room(gameName, host.name, host);
    room.password = password;
    room.addPerson(host);
    room.invited = invitedPlayers;
    rooms.push(room);
    return room;
}

function checkEmptyInviteRoom(roomName){
    var room = getRoom(roomName);
    if(rooms[room].invited.length == 0){
        rooms.splice(room, 1);
    }
}




/* Creates the HTML for the game room table of all players invited */
function getGameInvitesList(room){
    var table = "<thead> <tr> <th> Name </th> <th>Invite</th></tr> </thead> ";

}


