/////////////////////////////////////////
//           chat Client Interface .js
//        Works to help sort out incoming messages.
//			by Ben Jaberg, last updated 11/26/2013
/////////////////////////////////////////


    var chatClientInterface  = function () {
        var _public = {};
    
        //things are going out from our client, Ben handles this!
        _public.sendOutboxMessage = function(outboxMessage){
            clientInterface.chatSendMessage(outboxMessage);
        };
    
        //things are coming in to our client, Craig handles this!
        _public.receiveInboxMessage = function(inboxMessage) {
              guiInterface.receiveInboxMessage(inboxMessage);
        };
        _public.receivePrivateMessage = function(privateMessage){
              guiInterface.receivePrivateMessage(privateMessage);  
        };
        _public.receiveOutboxConfirmation = function(yourMessage) {
              guiInterface.receiveOutboxConfirmation(yourMessage);  
        };
    
    
        return _public; 
    
    }();
