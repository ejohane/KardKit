
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


    _public.updateCardCount = function(socket, ratSlap){
        //draw their amount of cards
        for(var i in ratSlap.allPlayers){
            var currentPlayer = ratSlap.allPlayers[i];
            for(var j in ratSlap.allPlayers){
                this.setCardCounts(socket, currentPlayer.gameID, j, ratSlap.playerHands[j].numCards);
            }                
        }
    };


     return _public;
    }
}();

module.exports = ServerInterface;
