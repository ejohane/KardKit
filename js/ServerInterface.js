
var ServerInterface = function () {
     var _public = {};
       
     _public.setUIFramework = function(client, a1,a2,a3,a4){
        client.emit("setUIFramework", a1,a2,a3,a4);
     };

    _public.setActions = function(socket, clientID, actions){
	socket.sockets.socket(clientID).emit("setActions", actions);
     };

    _public.addPlayer = function(socket, clientID, playerName, playerList){
        socket.sockets.socket(clientID).emit("addPlayer",playerName);
    };

    _public.removePlayer = function(socket, clientID, index){
        socket.sockets.socket(clientID).emit("removePlayer",index);
    };

     _public.play = function(socket, gameRoom, topCard){
        socket.sockets.in(gameRoom).emit("play", topCard);
     };

	_public.setCards = function(socket, clientID, playerID, card){
		socket.sockets.socket(clientID).emit("addCard", playerID, card);
	};

	_public.setCardCounts = function(socket, clientID, playerID, num){
		socket.sockets.socket(clientID).emit("setHandCount", playerID, num);
	};

	_public.setPlayerPosition = function(socket, clientID, playerName){
		socket.sockets.socket(clientID).emit("addPlayer", playerName);
	};


    _public.updateCardCountFromRatSlap = function(socket, clientName, ratSlap,cards){
        for(var i in ratSlap.allPlayers){
            var currentPlayer = ratSlap.allPlayers[i];
            var index = getTrackingNumByPlayer(currentPlayer,clientName);
            this.setCardCounts(socket, currentPlayer.gameID,index, cards);
        }
    };

    _public.updateActionsFromRatSlap = function(socket, ratSlapGame){
        if(ratSlapGame != null){
            //determine actions for each player
            for(var i = 0; i < ratSlapGame.allPlayers.length ; i++){
                var currentPlayer = ratSlapGame.allPlayers[i];
                    for(var j in ratSlapGame.allPlayers){
                        var playerActions = [];
                        playerActions.push(ratSlapGame.slapEnabledArray[j]);
                        playerActions.push(ratSlapGame.playEnabledArray[j]);
                        playerActions.push(1);
                        console.log(playerActions);
                        this.setActions(socket,currentPlayer.gameID, playerActions);

                    } 
                        
            }    
        }
        
    }


     return _public;
}();

module.exports = ServerInterface;
