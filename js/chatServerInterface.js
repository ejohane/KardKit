//Serverside chat functionality
//Created by Ben Jaberg

function chatServerInterface(socket){
	this.socket = socket;
};

chatServerInterface.prototype.sendChat = function(message, senderID, receiverID, isPM) {
		
			if (senderID = receiverID){
				this.socket.sockets.socket(receiverID).emit("ChatConfirmMessage", message); //UNSAFE!
			} else if (isPM) {
				this.socket.sockets.socket(receiverID).emit("ChatPrivateMessage", message); //UNSAFE!
			} else {
				this.socket.sockets.socket(receiverID).emit("ChatReceiveMessage", message); //UNSAFE!
			}
		}
		
chatServerInterface.prototype.digest = function(message, senderID, lobby) {
			
			console.log("Chat message from " + senderID + ": " + message);
			
			//First, check if message is supposed to be private
			var isPrivate = false;
			for (var i in lobby.players){
				var pName = lobby.players[i].name;
				if (message.indexOf("!".concat(pName)) != -1){
					isPrivate = true;
					this.sendChat(message, senderID, lobby.players[i].id, true);
					this.sendChat(message, senderID, senderID, false);
				}
			}
			
			if (!isPrivate){
				var P = lobby.getPlayerByID(senderID);
				var roomName = P.getRoomName();
				if (roomName != "none"){ //Sends only to those in-game
					var R = lobby.getRoom(roomName, "gameRoom");
					for (var i in R.people){
						this.sendChat(message, senderID, R.people[i].id, false);
					}
				} else { //Sends to everyone in the lobby
					for (var i in lobby.players){
						if (lobby.players[i].status != "In-Game"){
							this.sendChat(message, senderID, lobby.players[i].id, false);
						}
					}
				}
			}
		}
		
module.exports = chatServerInterface;
