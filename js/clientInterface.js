//Client to server interface

var clientInterface = function () {
		var _public = {};
		
		_public.chatSendMessage = function(chatMessage){
			socket.emit("ChatSendMessage", chatMessage);
		}
		
		return _public;
	
	}();