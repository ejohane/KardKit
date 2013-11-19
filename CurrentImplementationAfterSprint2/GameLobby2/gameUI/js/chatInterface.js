////////////////////////////////////////////////////////

//         

//                   chat interface .js

//

//////////////////////////////////////////////////////


    var chatInterface  = function () {
        var _public = {};
    
        //things are going out from our client, Ben handles this!
        _public.sendOutboxMessage = function(outboxMessage){            
            alert('got here with message : ' + outboxMessage + " , calling clientINterface!");
			clientInterface.out_sendOutboxMessage(outboxMessage);
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