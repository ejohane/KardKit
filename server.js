/******************************************************************************************
    Create By: Erik Johansson
    Last Updated: 11/25/2013 
******************************************************************************************/




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
var LobbyCommunication = require('./js/LobbyCommunication.js');
var lobby = new LobbyCommunication();
var ChatInterface = require('./js/chatServerInterface.js');
var chat = new ChatInterface(socket);


var RatSlapGame = require('./js/RatSlapGame.js');
var serverInterface = require('./js/ServerInterface.js');

// Get size of an object (used for players object)
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};



/************************************************************************************************************************************************
*************************************************************************************************************************************************
****************************************************************Socket Connections **************************************************************
*************************************************************************************************************************************************
************************************************************************************************************************************************/

socket.on('connection', function (client) {

    /*********************************************************************
    ********************** KARD KIT LOBBY FUNCTIONS ************************
    **********************************************************************/

    /********************************************************************
        Created By: Erik Johansson      On: 10/16/2013
        This function adds a player to the lobby page, and updates everyone in
        lobby's page to show that they joing
    ********************************************************************/  
    client.on('addPlayer', function(playerName){
        console.log("adding player -----");

        if (lobby.checkValidPlayer(playerName)){
            var player = lobby.createPlayer(playerName, client.id);
            if(player != null){
                if(lobby.addPlayerToLobby(player)){
                    console.log("******** Player (" + lobby.players[client.id].name + ") with id: (" + lobby.players[client.id].id + ") has connected. ********");
                    console.log("People in Lobby: ");
                    for(var i = 0; i < lobby.lobbyRoom.people.length; i++){
                        console.log("   " + lobby.lobbyRoom.people[i].name); 
                    }
                    client.join(lobby.lobbyRoom);
                    socket.sockets.in(lobby.lobbyRoom).emit('playerAddedToLobby',lobby.getPlayerListHTML(), lobby.players[client.id].name);
                    socket.sockets.in(lobby.lobbyRoom).emit('updatedGamesList',lobby.getGameRoomList());
                    socket.sockets.in(lobby.lobbyRoom).emit('updatePlayerListGameRoom', lobby.getCreatePlayerListHTML());
                    client.emit('succesfullyJoined');
                }else{
                    console.log("Player: " + player.name +" unable to join the lobby");
                }
            }
        }else{
            console.log("player (" + player +") already exists!! or invalid player name");
        }
    });
 

    
    client.on("addExisistingPlayerToLobby", function(username){
        lobby.addExisistingPlayerToLobby(username, client.id);
        socket.sockets.in(lobby.lobbyRoom).emit('playerAddedToLobby',lobby.getPlayerListHTML(), lobby.players[client.id].name);
        socket.sockets.in(lobby.lobbyRoom).emit('updatedGamesList',lobby.getGameRoomList());
        socket.sockets.in(lobby.lobbyRoom).emit('updatePlayerListGameRoom', lobby.getCreatePlayerListHTML());

    });
    
    /********************************************************************
        Created By: Erik Johansson      On: 10/16/2013
        Checks if username is valid 
    ********************************************************************/  
    client.on('validatePlayer', function(playerName){
        client.emit("checkValidPlayer", lobby.checkValidPlayer(playerName));
    });

    /********************************************************************
        Created By: Erik Johansson      On: 10/16/2013
        Called when user updates their status; all players in lobby see status update
    ********************************************************************/  
    client.on("updateStatus", function(status){
        lobby.players[client.id].status = status;
        socket.sockets.in(lobby.lobbyRoom).emit('updatePlayerList',lobby.getPlayerListHTML());
        socket.sockets.in(lobby.lobbyRoom).emit('updatePlayerListGameRoom', lobby.getCreatePlayerListHTML());
    });

    /********************************************************************
        Created By: Erik Johansson      On: 10/16/2013
        This function handles when players disconnect
        Called when user disconnects from server !!!!!!!!!! NOT IMPLEMENTED YET 
    ********************************************************************/  
    client.on('disconnect', function(){
        console.log("Attempting to exit game")
        for(var i in lobby.players){
            //if player exits lobby
            if(lobby.players[i].id == client.id){
                if(lobby.players[i].room == null){
                    console.log("******** Player with id: (" + client.id + ") with name: ("+ lobby.players[client.id].name +") has disconnected ********");
                    socket.sockets.in(lobby.lobbyRoom).emit('receiveInboxMessage', lobby.players[client.id].name +" has left the lobby", "message"); 
                    lobby.playerDisconnected(client.id);
                    delete lobby.players[client.id];
                    for(var key in lobby.players) {
                      console.log("******** Remaining players: " + key + ": " + lobby.players[key].name +"********");
                    }   
                    break;
                }
            //if player exits game
            }else if(lobby.players[i].gameID == client.id){
                
                console.log("Player exiting game");
                socket.sockets.in(lobby.players[i].room).emit('closeGameSession', "kardkit.us:8127" );
                lobby.playerExitsGame(client.id);
                
                break;
            }
        }
        socket.sockets.in(lobby.lobbyRoom).emit('updatedGamesList', lobby.getGameRoomList());
        socket.sockets.in(lobby.lobbyRoom).emit('updatePlayerList',lobby.getPlayerListHTML());
    });

    client.on('r_quit',function(playerName){

    });

    /********************************************* Creating Games ****************************************************** */

    /*Creates the list of available playres for game creation modal */
    /********************************************************************
        Created By: Erik Johansson      On: 10/16/2013
        - Is called when lobby client needs to see list of available players to join game
        - Creates the list of available players for game creation modal
    ********************************************************************/  
    client.on("getCreateGamePlayerListHTML", function(){
        var table = lobby.getCreatePlayerListHTML();
        socket.sockets.in(lobby.lobbyRoom).emit('updatePlayerListGameRoom', table);
    });
    
    
    /********************************************************************
        Created By: Erik Johansson      On: 10/16/2013
        - Checks if valid game name, then creates it if true 
        - This function will create a GameRoom as well as a InvitedRoom
        - The GameRoom contains all the game information, the invited room keeps a list of all invited players. 
        - This invited room makes it easier to emit to all invited playres 
    ********************************************************************/  
    client.on("validateGame", function(gameName, password, invitedPlayers){
        if(lobby.validateGame(gameName)){
            var room = lobby.createGame(gameName, password, invitedPlayers, client.id, 4);
            client.join(room.name);
            
            var invitedGameName = gameName + "_Invited";
            var invitedRoom = lobby.createInviteeRoom(invitedPlayers, invitedGameName, lobby.players[client.id], password);
       
            if(invitedRoom.invited != null && invitedRoom.invited.length != 0){
                for(var i in invitedRoom.invited){
                    socket.sockets.socket(invitedRoom.invited[i].id).join(invitedRoom.name);
                }
                console.log("PASSWORD: "+invitedRoom.password);
                if(invitedRoom.password == undefined)
                    socket.sockets.in(invitedRoom.name).emit('playerInvited', lobby.players[client.id].name +" has invited you to play a game!");
                else
                    socket.sockets.in(invitedRoom.name).emit('playerInvited', lobby.players[client.id].name +" has invited you to play a game!", invitedRoom.password);
            }

            var table = lobby.getGameRoomList();
            socket.sockets.in(lobby.lobbyRoom).emit('updatedGamesList', table);
            socket.sockets.in(lobby.lobbyRoom).emit('updatePlayerList',lobby.getPlayerListHTML());
            client.emit('moveToGame');
        }
    });

    
    /*********************************************************************
    ********************** JOINING GAME FUNCTIONS ************************
    **********************************************************************/


    /********************************************************************
        Created By: Erik Johansson      On: 10/30/2013
        - This function is called when a user clicks on join game.
        - It adds the player to the game room
    ********************************************************************/  
    client.on('joinGame', function(){
        console.log(lobby.players[client.id].invitedGame);
        var player = lobby.players[client.id];
        //Remove player from invited room
        client.leave(player.invitedGame);
        //Remove room if empty
        lobby.checkEmptyInviteRoom(player.invitedGame);
        //Join Created Room
        var gameName = (player.invitedGame).replace("_Invited", "");
        var room = lobby.addPlayerToGame(gameName, lobby.players[client.id]);
        if(room != null) client.join(room.name);
        var table = lobby.getGameRoomList();
        socket.sockets.in(lobby.lobbyRoom).emit('updatedGamesList', table);
        socket.sockets.in(lobby.lobbyRoom).emit('updatePlayerList',lobby.getPlayerListHTML());
        
    });

     /*********************************************************************
    ********************** CHAT FUNCTIONS ************************
    **********************************************************************/


    /********************************************************************
        Created By: Erik Johansson      On: 10/30/2013
        - This function is called when a user clicks sends a public message
        
        Update By: Ben Jaberg       On: 11/26/2013
        - Calls the digest method of the chatServerInterface to decide if the message
            is private, public, or anything else.
    ********************************************************************/  
    client.on("chatSendPublicMessage", function(message){
        chat.digest(message, client.id, lobby);
    });


   /*********************************************************************
    ********************** Game ROOM Functions ************************
    **********************************************************************/


    /* This function is called once the game page has loaded
        It assigns the players new client ID to gameID.
        If a Game Logic Instance does not exist, it adds it to the game room.
        It then sets the actionbar for that game.
    */
    client.on("gameLoaded", function(username){
        var player = lobby.getPlayer(username);
        if(player != null){
            player.gameID = client.id;
        }else{
            console.log("WHYYYYYY");
        }

        //client.emit("setActions", [1, 1]);
        var ratSlapGame = player.room.RatSlapGame;
        if(ratSlapGame == null){
            ratSlapGame = new RatSlapGame(player.room);
            player.room.setGame(ratSlapGame);
            console.log("RatSlapGame Created");
        }
        console.log(player.room.people.length);

        serverInterface.setUIFramework(client, ratSlapGame.completeActionlistNames,ratSlapGame.completeActionlistLabels,ratSlapGame.completeActionlistKeyCodes,ratSlapGame.completeActionlistKeyLabels);

        if(player.room.people.length == 4){
            ratSlapGame.setup();
    	    var pOrder = ratSlapGame.allPlayers;
    	    
    	    serverInterface.setPlayerPosition(socket,pOrder[0].gameID,pOrder[0].name);
    	    serverInterface.setPlayerPosition(socket,pOrder[0].gameID,pOrder[1].name);
    	    serverInterface.setPlayerPosition(socket,pOrder[0].gameID,pOrder[2].name);
    	    serverInterface.setPlayerPosition(socket,pOrder[0].gameID,pOrder[3].name);
    	    serverInterface.setPlayerPosition(socket,pOrder[1].gameID,pOrder[1].name);
    	    serverInterface.setPlayerPosition(socket,pOrder[1].gameID,pOrder[2].name);
    	    serverInterface.setPlayerPosition(socket,pOrder[1].gameID,pOrder[3].name);
    	    serverInterface.setPlayerPosition(socket,pOrder[1].gameID,pOrder[0].name);
    	    serverInterface.setPlayerPosition(socket,pOrder[2].gameID,pOrder[2].name);
    	    serverInterface.setPlayerPosition(socket,pOrder[2].gameID,pOrder[3].name);
    	    serverInterface.setPlayerPosition(socket,pOrder[2].gameID,pOrder[0].name);
    	    serverInterface.setPlayerPosition(socket,pOrder[2].gameID,pOrder[1].name);
    	    serverInterface.setPlayerPosition(socket,pOrder[3].gameID,pOrder[3].name);
    	    serverInterface.setPlayerPosition(socket,pOrder[3].gameID,pOrder[0].name);
    	    serverInterface.setPlayerPosition(socket,pOrder[3].gameID,pOrder[1].name);
    	    serverInterface.setPlayerPosition(socket,pOrder[3].gameID,pOrder[2].name);	    

    	    var rts = player.room;
    	    for (var i in rts.people){
        		for (var j = 0; j < 4; j++){
        			serverInterface.setCards(socket,rts.people[i].gameID,j,[null, null]);
        			serverInterface.setCardCounts(socket,rts.people[i].gameID,j,13);
        		}
		          serverInterface.setActions(socket,rts.people[i].gameID, ratSlapGame.actionsToGive);
            }
	    
        }

    });

//<<<<<<< HEAD
//=======
    /*********************************************************************
    ********************** Toolkit Functions ************************
    **********************************************************************/
    client.on("r_sendOutboxMessage", function(outboxMessage){
        console.log("out_sendOutboxMessage called with arg = " + outboxMessage);
        chat.digest(outboxMessage, client.id,lobby);            
    });

    client.on("r_draw", function(playerName){
        console.log("out_draw with playername = " + playerName);
    });
    client.on("r_takeCard", function(playerNameOwner,cardIndex,playerNameReceiver){
        console.log("out_takeCard with owner playername = " + playerNameOwner + " , cardIndex = " + cardIndex + " , receiver playername = " + playerNameReceiver);
        
    });
//>>>>>>> 58efb634379783c763f551db0d0af279d8e4ff23
  
    
    /*********************************************************************
    ********************** Rat Slap Functions ************************
    **********************************************************************/
 client.on("r_play", function(){
        var affectedGameRoom = lobby.getRoom(lobby.players[client.id].getRoomName ,"gameRoom");
        if (affectedGameRoom !== null){
            affectedGameRoom.getGame.playAction();
            serverInterface.play(socket, affectedGameRoom, affectedGameRoom.game.topCard());
        }
    });

    client.on("r_slap", function(){
        var affectedGameRoom = lobby.getRoom(lobby.players[client.id].getRoomName ,"gameRoom");
        if (affectedGameRoom !== null){
            affectedGameRoom.getGame.slapAction(lobby.players[client.id]);
        }
    });

});


