function clientInterface(socket){
	this.socket = socket;
};

/* private
--------------------------------*/
clientInterface.prototype.addCard = function(playerId, card){
	guiInterface.addCard(playerId,card);    
}
    
clientInterface.prototype.removeCard = function(playerId, cardIndex){
	guiInterface.removeCard(playerId, cardIndex);
}    
    
/* incoming
--------------------------------------*/
clientInterface.prototype.setUIFramework = function(completeActionlistNames,
                                    completeActionlistLabels,
                                    completeActionlistKeyCodes,
                                    completeActionlistKeyLabels){  
    guiInterface.setActionbarFramework(completeActionlistNames,completeActionlistLabels,completeActionlistKeyCodes,completeActionlistKeyLabels);        
};

clientInterface.prototype.addPlayer = function(playerName){
    guiInterface.addPlayerFramework(playerName);  
};

clientInterface.prototype.removePlayer = function(playerId){
    guiInterface.removePlayer(playerId);   
}; 
   
clientInterface.prototype.setActions = function(actionsToGive){
    guiInterface.setActions(actionsToGive);        
};

clientInterface.prototype.setHand = function(playerId, hand) {
    guiInterface.setHand(playerId, hand);
};

clientInterface.prototype.setName = function(playerId, playerName){
     guiInterface.setName(playerId,playerName);
};

clientInterface.prototype.setPoints = function(playerId, playerPoints){
     guiInterface.setPoints(playerId,playerPoints);
};

clientInterface.prototype.removeCard = function(playerId, cardIndex){
    removeCard(playerId, cardIndex);  
};

clientInterface.prototype.addCard = function(playerId,card){
    addCard(playerId, card);
};

clientInterface.prototype.draw = function(playerId, card){
    addCard(playerId, card);     
};
 
clientInterface.prototype.discard = function(playerId, cardIndex){
    removeCard(playerId, cardIndex);  
};

clientInterface.prototype.takeCard = function(playerIdOwner,cardIndexTaken,playerIdReceiver,cardTaken){
	removeCard(playerIdOwner, cardIndexTaken);		
	addCard(playerIdReceiver, cardTaken);
};

clientInterface.prototype.receiveInboxMessage = function(inboxMessage){
    guiInterface.receiveInboxMessage(inboxMessage);  
};

clientInterface.prototype.receivePrivateMessage = function(privateMessage){
    guiInterface.receivePrivateMessage(privateMessage);  
};

clientInterface.prototype.receiveOutboxConfirmation = function(yourMessage) {
    guiInterface.receiveOutboxConfirmation(yourMessage);  
};

    /* outgoing
    --------------------------------------*/

	//NOTE FROM BEN:
	//Should the bottom functions just coordinate with the ratSlap game commands the server is expecting?
	//If that's the case, a lot of the arguments can actually be cut.
	
clientInterface.prototype.out_sendOutboxMessage = function(outboxMessage){
	socket.emit("chatSendPublicMessage", outboxMessage);
};

clientInterface.prototype.out_playCard = function(playerName, cardIndex){
    //alert("function playCard : call the server with playername = " + playerName + " , cardIndex = " + cardIndex);
	socket.emit("r_playCard", playerName, cardIndex);
};

clientInterface.prototype.out_slap = function(playerName){
    //alert("function slap: call the server with playername = " + playerName);
	socket.emit("r_slap", playerName);
};

clientInterface.prototype.out_draw = function(playerName){
    //alert("function draw: call the server with playername = " + playerName);
	socket.emit("r_draw", playerName);
};

clientInterface.prototype.out_takeCard = function(playerNameOwner,cardIndex,playerNameReceiver){
    //alert("function takeCard: call the server with owner playername = " + playerNameOwner + " , cardIndex = " + cardIndex + " , receiver playername = " + playerNameReceiver);
	socket.emit("r_takeCard", playerNameOwner, cardIndex, playerNameReceiver);
};

module.exports = clientInterface;