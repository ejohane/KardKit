
var ServerInterface = function () {
     var _public = {};
       
     _public.setUIFramework = function(client, a1,a2,a3,a4){
        client.emit("setUIFramework", a1,a2,a3,a4);
     };

    _public.setActions = function(socket, clientID, actions){
	socket.sockets.socket(clientID).emit("setActions", actions);
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
    
     return _public;
}();

module.exports = ServerInterface;
