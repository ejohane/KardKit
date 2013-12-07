
var clientInterface = function () {
     var _public = {};

    /* private
    --------------------------------*/
    function addCard(playerId, card){
        guiInterface.addCard(playerId,card);    
    }
    function removeCard(playerId, cardIndex){
        guiInterface.removeCard(playerId, cardIndex);
    }    
    /* incoming
    --------------------------------------*/

    _public.setUIFramework = function(completeActionlistNames,
                                      completeActionlistLabels,
                                      completeActionlistKeyCodes,
                                      completeActionlistKeyLabels){
        alert("here");  
         guiInterface.setActionbarFramework(completeActionlistNames,completeActionlistLabels,completeActionlistKeyCodes,completeActionlistKeyLabels);        
    };
    _public.addPlayer = function(playerName){
         guiInterface.addPlayerFramework(playerName);  
    };
    _public.removePlayer = function(playerId){
         guiInterface.removePlayer(playerId);   
    };    
    _public.setActions = function(actionsToGive){
        alert("here2"); 
        guiInterface.setActions(actionsToGive);        
    };
    _public.setHand = function(playerId, hand) {
        guiInterface.setHand(playerId, hand);
    };
    _public.setName = function(playerId, playerName){
         guiInterface.setName(playerId,playerName);
    };
    _public.setPoints = function(playerId, playerPoints){
         guiInterface.setPoints(playerId,playerPoints);
    };
    _public.removeCard = function(playerId, cardIndex){
         removeCard(playerId, cardIndex);  
    };
    _public.addCard = function(playerId,card){
        addCard(playerId, card);
    };
    _public.draw = function(playerId, card){
        addCard(playerId, card);     
    };
    _public.discard = function(playerId, cardIndex){
        removeCard(playerId, cardIndex);  
    };
        _public.takeCard = function(playerIdOwner,cardIndexTaken,playerIdReceiver,cardTaken){
                removeCard(playerIdOwner, cardIndexTaken);                
                addCard(playerIdReceiver, cardTaken);
        };
    _public.receiveInboxMessage = function(inboxMessage){
        guiInterface.receiveInboxMessage(inboxMessage);  
    };
    _public.receivePrivateMessage = function(privateMessage){
        guiInterface.receivePrivateMessage(privateMessage);  
    };
    _public.receiveOutboxConfirmation = function(yourMessage) {
        guiInterface.receiveOutboxConfirmation(yourMessage);  
    };
    /* outgoing
    --------------------------------------*/
    _public.out_sendOutboxMessage = function(outboxMessage){
        alert("out_sendOutboxMessage called with arg = " + outboxMessage);
        socket.emit("r_sendOutboxMessage", outboxMessage);            
    };
    _public.out_playCard = function(playerName, cardIndex){
        alert("out_playCard with playername = " + playerName + " , cardIndex = " + cardIndex);
        socket.emit("r_play", playerName, cardIndex);
    };
    _public.out_slap = function(playerName){
        alert("out_slap with playername = " + playerName);
        socket.emit("r_slap", playerName);
    };
    _public.out_draw = function(playerName){
        alert("out_draw with playername = " + playerName);
        socket.emit("r_draw", playerName);
    };
    _public.out_takeCard = function(playerNameOwner,cardIndex,playerNameReceiver){
        alert("out_takeCard with owner playername = " + playerNameOwner + " , cardIndex = " + cardIndex + " , receiver playername = " + playerNameReceiver);
        socket.emit("r_takeCard", playerNameOwner, cardIndex, playerNameReceiver);
    };
    
    
     return _public;
}();

var socket = io.connect('142.4.210.12:8127');

socket.emit("gameLoaded", $.cookie("KardKit-username"));

socket.on("setUIFramework", function(a1,a2,a3,a4){
    clientInterface.setUIFramework(a1,a2,a3,a4);
});

socket.on("setActions", function(a1){
    clientInterface.setActions(a1);
});
