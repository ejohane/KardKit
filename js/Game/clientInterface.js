
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
         guiInterface.setActionbarFramework(completeActionlistNames,completeActionlistLabels,completeActionlistKeyCodes,completeActionlistKeyLabels);        
    };
    _public.addPlayer = function(playerName){
         guiInterface.addPlayerFramework(playerName);  
    };
    _public.removePlayer = function(playerId){
         guiInterface.removePlayer(playerId);   
    };    
    _public.setActions = function(actionsToGive){ 
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
    _public.setHandCount = function(playerId, handCount){
	guiInterface.setHandCount(playerId,handCount);
    };
    _public.removeCard = function(playerId, cardIndex){
         removeCard(playerId, cardIndex);  
    };
    _public.addCard = function(playerId,card){
        addCard(playerId, card);
    };
	_public.play = function(card){
        guiInterface.play(card);
    };
	_public.emptyPile = function(){
        guiInterface.emptyPile();
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
    _public.closeGameSession = function(){
        alert("The server must close this game session due to a player disconnect. Redirecting to lobby...");
        window.location = "./home.html";
    };
    _public.youWon = function(){
	alert("You won the game! Thanks for playing!");
        window.location = "./home.html";
    };
    _public.youLost = function(winnerName){
        alert("Player " + winnerName + " won the game");
        window.location = "./home.html";
    };


    /* outgoing
    --------------------------------------*/
    _public.out_sendOutboxMessage = function(outboxMessage){
        socket.emit("sendOutboxMessage", outboxMessage);
    };
    _public.out_playCard = function(playerName, cardIndex){
	socket.emit("r_play", playerName, cardIndex);
    };
    _public.out_slap = function(playerName){
	socket.emit("r_slap", playerName);
    };
    _public.out_draw = function(playerName){
	socket.emit("r_draw", playerName);
    };
    _public.out_takeCard = function(playerNameOwner, cardIndex, playerNameReceiver){
	socket.emit("r_takeCard",   playerNameOwner, cardIndex, playerNameReceiver);
    };    
    _public.out_quit = function(playerName){
        socket.emit("r_quit", playerName);
    };
    
     return _public;
}();





/* init socket capability
-----------------------------------------------------------*/
var socket = io.connect('142.4.210.12:8127');

/* everything has loaded on user side, tell server I am here
-----------------------------------------------------------*/
socket.emit("gameLoaded", $.cookie("KardKit-username"));


/* receive updates from server
-----------------------------------------------------------*/
    socket.on("setUIFramework", function(a1,a2,a3,a4){
        clientInterface.setUIFramework(a1,a2,a3,a4);
    });

    socket.on("setActions", function(a1){
        clientInterface.setActions(a1);
    });

    socket.on("addPlayer", function(playerName){
         clientInterface.addPlayer(playerName);
    });
    socket.on("removePlayer", function(playerId){
         clientInterface.removePlayer(playerId);
    });
    socket.on("setHand", function(playerId, hand) {
        clientInterface.setHand(playerId, hand);
    });
    socket.on("setName", function(playerId, playerName){
         clientInterface.setName(playerId,playerName);
    });
    socket.on("setPoints", function(playerId, playerPoints){
         clientInterface.setPoints(playerId,playerPoints);
    });
    socket.on("setHandCount", function(playerId, handCount){
         clientInterface.setHandCount(playerId,handCount);
    });
    socket.on("removeCard", function(playerId, cardIndex){
         clientInterface.removeCard(playerId, cardIndex);
    });
    socket.on("addCard", function(playerId,card){
        clientInterface.addCard(playerId, card);
    });
	socket.on("play", function(card){
        clientInterface.play(card);
    });
	socket.on("emptyPile", function(){
        clientInterface.emptyPile();
    });	
    socket.on("draw", function(playerId, card){
        clientInterface.draw(playerId, card);
    });
    socket.on("discard", function(playerId, cardIndex){
        clientInterface.discard(playerId, cardIndex);
    });
    socket.on("takeCard", function(playerIdOwner,cardIndexTaken,playerIdReceiver,cardTaken){
	    clientInterface.takeCard(playerIdOwner,cardIndexTaken,playerIdReceiver,cardTaken);        
    });
    socket.on("receiveInboxMessage", function(inboxMessage){
        clientInterface.receiveInboxMessage(inboxMessage);
    });
    socket.on("receivePrivateMessage", function(privateMessage){
        clientInterface.receivePrivateMessage(privateMessage);
    });
    socket.on("receiveOutboxConfirmation", function(yourMessage) {
        clientInterface.receiveOutboxConfirmation(yourMessage);
    });
    socket.on("closeGameSession", function() {
        clientInterface.closeGameSession();
    });
    socket.on("youWon", function(){
	clientInterface.youWon();
    });
    socket.on("youLost", function(winnerName){
        clientInterface.youLost(winnerName);
    });

