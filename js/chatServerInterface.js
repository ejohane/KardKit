//Serverside chat functionality

var chatServerInterface = function () {
		var _public = {};
		
		_public.chatDigest = function(message, senderID) {
			
			var finalMessage = players[senderID].name + ": " + message;
			
			//First, check if message is supposed to be private
			var isPrivate = false;
			for (var i in players){
				if (message.indexOf("!".concat(players[i].name)) != -1){
					isPrivate = true;
					sendChat(finalMessage, senderID, players[i].id, true);
					sendChat(finalMessage, senderID, senderID, false);
				}
			}
			
			if (!isPrivate){
				for (var i in players){
					sendChat(message, senderID, players[i].id, false);
				}
			}
		}
		
		_public.sendChat = function(message, senderID, receiverID, isPM) {
		
			if (senderID = receiverID){
				socket.sockets.socket(receiverID).emit("ChatConfirmMessage", finalMessage); //UNSAFE!
			} else if (isPM) {
				socket.sockets.socket(receiverID).emit("ChatPrivateMessage", finalMessage); //UNSAFE!
			} else {
				socket.sockets.socket(receiverID).emit("ChatReceiveMessage", finalMessage); //UNSAFE!
			}
		}
 
		return _public;
	}();