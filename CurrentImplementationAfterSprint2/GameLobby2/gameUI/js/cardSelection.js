////////////////////////////////////////////////////////

//         

//                   card selection .js

//

//////////////////////////////////////////////////////


var cardSelection = function () {
    var _public = {};
    
    /*private
    -------------------------------------------------*/
    function getPlayerIdOfSelectedCardToTake(){
        for(var i = 1; i < SELECTED_CARDS.length; i++){
            if(SELECTED_CARDS[i].length > 0){
                return i;
            }
        }
    }
    
    function getSelectedCardIndexFromPlayerId(playerId){
       return SELECTED_CARDS[playerId][0];
    }
    
    function cardIsShown(playerId, cardIndex){
        var visible = false;        
        $("#playerSpot_" + playerId + " > .hand > .card").each(function (index,el){
            if(index === cardIndex){
                if($(el).find("div.front").length > 0){
                     visible = true;   
                }
            }
        });
        return visible;
    }    
    
    function addHighlight(playerId, cardIndex){
        if(cardIsShown(playerId, cardIndex)){
            $("#playerSpot_" + playerId + " > .hand > .card:eq(" + cardIndex + ")").find("div.front").addClass("highlight");        
        }else{
            $("#playerSpot_" + playerId + " > .hand > .card:eq(" + cardIndex + ")").addClass("highlight");
        }        
    }
    
    function removeHighlight(playerId, cardIndex){
        if(cardIsShown(playerId, cardIndex)){
            $("#playerSpot_" + playerId + " > .hand > .card:eq(" + cardIndex + ")").find("div.front").removeClass("highlight");        
        }else{
            $("#playerSpot_" + playerId + " > .hand > .card:eq(" + cardIndex + ")").removeClass("highlight");
        }
    }
    
    function notAlreadySelected(playerId, cardIndex) {
        return (-1 === $.inArray(cardIndex, SELECTED_CARDS[playerId]));
    }
    
    function playerOwnsCard(playerId, cardObject) {
        var owns = false;
        $("#playerSpot_" + playerId + " > .hand > .card").each( function(i, el){
                if(cardObject === el){
                    owns = true;
                }                
        });
        return owns;
    }
    
    function getPlayerIdOwningCard(cardObject){
        var playerIdOwningCard = -1;
        for(var playerIndex = 0; playerIndex < PLAYERS.length; playerIndex++){            
            if(playerOwnsCard(playerIndex, cardObject)){
              playerIdOwningCard = playerIndex;   
            }
        }
        return playerIdOwningCard;        
    }
    
    _public.select = function(cardObject){
       var playerId = getPlayerIdOwningCard(cardObject);
       if(playerId === -1){alert("didnt find a playerId owning card!");}
       var selectedCardIndex = $("#playerSpot_" + playerId + " > .hand > .card").index(cardObject);
       if(notAlreadySelected(playerId, selectedCardIndex)){
            SELECTED_CARDS[playerId].push(selectedCardIndex);
            addHighlight(playerId,selectedCardIndex);
        }else{
            var arrayIndex = SELECTED_CARDS[playerId].indexOf(selectedCardIndex);
            SELECTED_CARDS[playerId].splice(arrayIndex, 1);
            removeHighlight(playerId, selectedCardIndex);
        } 
    };
    _public.getPlayerIdOfSelectedCardToTake = function(){
       return getPlayerIdOfSelectedCardToTake();
    };
    _public.getSelectedCardIndexFromPlayerId = function(playerId){
       return getSelectedCardIndexFromPlayerId(playerId);
    };
    
    return _public;
}();