/////////////////////////////////////////
//           GUI .js

//  try to keep all modifications that aren't specific to a keypress, click, or other specific action HERE


// this will either talk directly through chatInterface.js or clientInterface.js 
///////////////////////////////////////////

    var guiInterface = function () {
        var _public = {};    
    
        //chat UI
        function addInboxMessage(message, type){  
            switch(type){
                case "confirmation" :
                case "message":
                case "privateMessage":
                    var spanElement = document.createElement("span");
                    spanElement.innerHTML = message;
                    spanElement.className = type;
                    var parent = document.getElementById("inbox");
                    parent.appendChild(spanElement);
                    parent.appendChild(document.createElement("br"));
                    break;            
                default:
                    alert('Not a type of message!');
            }
        }    
    
        _public.receiveInboxMessage = function (inboxMessage){
             addInboxMessage(inboxMessage,"message");
        };
        
        _public.receivePrivateMessage = function (privateInboxMessage){
              addInboxMessage(privateInboxMessage,"privateMessage");
        };
    
        _public.receiveOutboxConfirmation = function (yourMessage){
            addInboxMessage(yourMessage, "confirmation");
        };
    
        _public.sendOutboxMessage = function () {
            var outboxMessage = $("#outbox").val();
            chatInterface.sendOutboxMessage(outboxMessage);
            $("#outbox").val("");
            $("#outbox").blur(); 
        };
    
        //set player specific game content
        _public.setHand = function (playerId, cardArray){
             generateHand.generate(playerId,cardArray);   
        };
        _public.setName = function (playerId, playerName){
             generateName.generate(playerId,playerName);   
        };
        _public.setPoints = function (playerId, playerPoints){
             generatePoints.generate(playerId,playerPoints);   
        };
        
        
        return _public;    
    }();
