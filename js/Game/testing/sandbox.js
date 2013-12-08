var sandbox = function () {
    var _public = {};
    
    function makeCard(cardText){
        // remove and parse text input
        cardText = cardText.replace(/"/g , "");
        cardText = cardText.replace(/'/g , "");
        //parse text into card object
        cardText = cardText.substr(1, cardText.length - 2); // strip the brackets on this card
        var cardParams = cardText.split(",");
        if(cardParams[0] === "null"){ 
            cardParams = [null,null]; 
        }
        return [cardParams[0], cardParams[1]];        
    }
    
    function makeHand(cardArrayAsText){
        cardArrayAsText = cardArrayAsText.substr(1, cardArrayAsText.length - 2); //strip the outermost brackets
        cardArrayAsText = cardArrayAsText.replace(/],/g , "]*"); //distinguish between commas in the cards and commas that separate cards        
        var cardArray = cardArrayAsText.split("*");
		//make hand object
        var hand = [], card;
        for(var i = 0; i < cardArray.length; i++){
            hand[i] = makeCard(cardArray[i]);
        }
        return hand;
    }
    
    function makeArray(text){
        text = text.substr(1, text.length - 2); //remove outer brackets
        var array = text.split(",");
        for(var i = 0; i < array.length; i++)
	{
	    array[i] = $.trim(array[i]);
	}
	return array;        
    }
    
    _public.doFunction = function(functionName, argsElement) {
        var args = []; var arg; 
        for(var childId = 0; childId < argsElement.children.length; childId++){
            arg = argsElement.children[childId].value;
            args[childId] = $.trim(arg);
        }
        
        switch(functionName){
            case "addPlayer":
                clientInterface.addPlayer(args[0]);
                break;
            case "removePlayer":
                clientInterface.removePlayer(args[0]);
                break;
            case "setActions":
                clientInterface.setActions(makeArray(args[0]));
                break;
            case "setName":
                clientInterface.setName(args[0],args[1]);
                break;
            case "setPoints":
                clientInterface.setPoints(args[0],args[1]);
                break;
            case "setHandCount":
                clientInterface.setHandCount(args[0],args[1]);
                break;
            case "setHand":                
                clientInterface.setHand(args[0],makeHand(args[1]));
                break;
            case "addCard":
                clientInterface.addCard(args[0],makeCard(args[1]));
                break;
            case "removeCard":
                clientInterface.removeCard(args[0],args[1]);
                break;
            case "receivePrivateMessage":
                clientInterface.receivePrivateMessage(args[0]);
                break;
            case "receiveInboxMessage":
                clientInterface.receiveInboxMessage(args[0]);
                break;
            case "receiveOutboxConfirmation":
                clientInterface.receiveOutboxConfirmation(args[0]);
                break;
            case "setUIFramework":
                clientInterface.setUIFramework(makeArray(args[0]),makeArray(args[1]),makeArray(args[2]),makeArray(args[3]));
                break;
            case "takeCard":                
                clientInterface.takeCard(args[0],args[1],args[2],makeCard(args[3]));
                break;
            case "closeGameSession":
                clientInterface.closeGameSession(args[0]);
	        break;
            default:
                alert("Sandbox function error!");
        }
    };
    
    return _public;
}();

$("#sandbox").on("click",".go", function() {
    sandbox.doFunction(this.parentNode.id,this.parentNode.children[2]);
});
