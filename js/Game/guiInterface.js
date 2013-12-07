var guiInterface = function () {
        var _public = {};
        
        /*private
        -------------------------------------------------*/        
        function setName(playerId,playerName){
            generateName.generate(playerId,playerName);
        }
        function setPoints(playerId,playerPoints){
            generatePoints.generate(playerId,playerPoints);
        }
        function setHand(playerId,hand){
            generateHand.generate(playerId,hand);
        }
        
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
        
        /* chat UI
        --------------------------------------*/   
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
            clientInterface.out_sendOutboxMessage(outboxMessage);
            $("#outbox").val("");
            $("#outbox").blur(); 
        };
        
        /*global initialization
        --------------------------------------*/
        _public.setActionbarFramework = function(completeActionlistNames,
                                                  completeActionlistLabels,
                                                  completeActionlistKeyCodes,
                                                  completeActionlistKeyLabels){
            for(var i = 0; i < completeActionlistNames.length; i++){
                ACTION_NAMES.push(completeActionlistNames[i]);
                ACTION_LABELS.push(completeActionlistLabels[i]);
                ACTION_KEY_CODES.push(completeActionlistKeyCodes[i]);
                ACTION_KEY_LABELS.push(completeActionlistKeyLabels[i]);  
            }
        };
        _public.addPlayerFramework = function(playerName){
            //set global variable for player count
            PLAYERS++;
			PLAYERS_AT_START++;            
            //set Html for player object            
            var playerHtml = "<div id=\"playerSpot_" + (PLAYERS - 1) + "\"><div class=\"hand\"></div><div class=\"playerName\">" + playerName + "</div><div class=\"playerPoints\"></div><div class=\"playerHand\"></div></div>";
            $("#players").append(playerHtml);                
            //set global variable for selecting cards by adding an array for this player
            SELECTED_CARDS.push([]);
        };
        //set this player's game content
        _public.setActions = function(actionsToGive){
              createActionbar.create(actionsToGive);  
        };        
        //set any player's game content
        _public.setHand = function (playerId, cardArray){
             setHand(playerId, cardArray);   
        };
        _public.setName = function (playerId, playerName){
             setName(playerId, playerName);   
        };
        _public.setPoints = function (playerId, playerPoints){
             setPoints(playerId, playerPoints);   
        };
        _public.setHandCount = function(playerId, handCount){
	     generateHand.setHandCount(playerId, handCount);
	};
        _public.removeCard = function(playerId, cardIndex){
             generateHand.removeCard(playerId,cardIndex);  
        };
        _public.addCard = function(playerId,card){
            generateHand.addCard(playerId,card);    
        };
        _public.removePlayer = function(playerId){
            $("#playerSpot_" + playerId).remove();
            SELECTED_CARDS[playerId] = null;
            PLAYERS--;
        };
        
        /* actions
        --------------------------------------*/
        _public.action_play = function () {
            var playerName = $("#playerSpot_0 .playerName").text();
            var cardIndex = SELECTED_CARDS[0][0];
            clientInterface.out_playCard(playerName, cardIndex);
        };
        _public.action_slap = function () {
            var playerName = $("#playerSpot_0 .playerName").text();
            clientInterface.out_slap(playerName);
        };
        _public.action_draw = function () {
            var playerName = $("#playerSpot_0 .playerName").text();
            clientInterface.out_draw(playerName);
        };
        _public.action_takeCard = function () {
            var playerNameReceiver = $("#playerSpot_0 .playerName").text();
			var playerIdOwner = cardSelection.getPlayerIdOfSelectedCardToTake();
			var playerNameOwner = $("#playerSpot_"+ playerIdOwner + " .playerName").text();
			var cardIndexTaken = cardSelection.getSelectedCardIndexFromPlayerId(playerIdOwner);
            clientInterface.out_takeCard(playerNameOwner,cardIndexTaken,playerNameReceiver);
        };
        
        return _public;    
    }();
