var generateHand = function () {
    var _public = {};
    var clubSuit = "&clubs;";
    var diamondSuit = "&diams;";    
    var heartSuit = "&hearts;";    
    var spadeSuit = "&spades;";
    
    var blackColorClass = "black";
    var redColorClass = "red";
    
    function getColor(localSuit){
        if(localSuit === clubSuit || localSuit === spadeSuit){
             return blackColorClass;   
        }
        return redColorClass;
    }

    function generateCardSymbolsHTML(number,suit){
        switch(number){
            case "2":
                return "<div class=\"spotB2\">" + suit + "</div>" +
"<div class=\"spotB4\">" + suit + "</div>";
                
            case "3":
                return "<div class=\"spotB1\">" + suit + "</div>" +
"<div class=\"spotB3\">" + suit + "</div>" + "<div class=\"spotB5\">" + suit + "</div>";
            case "4":
                return "<div class=\"spotA1\">" + suit + "</div>" +
"<div class=\"spotA5\">" + suit + "</div>" + "<div class=\"spotC1\">" + suit + "</div>" + "<div class=\"spotC5\">" + suit + "</div>";
            case "5":
                return "<div class=\"spotA1\">" + suit + "</div>" +
"<div class=\"spotA5\">" + suit + "</div>" + "<div class=\"spotB3\">" + suit + "</div>" + "<div class=\"spotC1\">" + suit + "</div>" + "<div class=\"spotC5\">" + suit + "</div>";
            case "6":
                return "<div class=\"spotA1\">" + suit + "</div>" +
"<div class=\"spotA3\">" + suit + "</div>" +
"<div class=\"spotA5\">" + suit + "</div>" + "<div class=\"spotC1\">" + suit + "</div>" + "<div class=\"spotC3\">" + suit + "</div>" + "<div class=\"spotC5\">" + suit + "</div>";
            case "7":
                return "<div class=\"spotA1\">" + suit + "</div>" +
"<div class=\"spotA3\">" + suit + "</div>" +
"<div class=\"spotA5\">" + suit + "</div>" +
"<div class=\"spotB2\">" + suit + "</div>" + 
"<div class=\"spotC1\">" + suit + "</div>" +
"<div class=\"spotC3\">" + suit + "</div>" + 
"<div class=\"spotC5\">" + suit + "</div>";
            case "8":
                return "<div class=\"spotA1\">" + suit + "</div>" +
"<div class=\"spotA3\">" + suit + "</div>" +
"<div class=\"spotA5\">" + suit + "</div>" +
"<div class=\"spotB2\">" + suit + "</div>" +
"<div class=\"spotB4\">" + suit + "</div>" +
"<div class=\"spotC1\">" + suit + "</div>" +
"<div class=\"spotC3\">" + suit + "</div>" + 
"<div class=\"spotC5\">" + suit + "</div>";
            case "9":
                return "<div class=\"spotA1\">" + suit + "</div>" +
"<div class=\"spotA2\">" + suit + "</div>" +
"<div class=\"spotA4\">" + suit + "</div>" +
"<div class=\"spotA5\">" + suit + "</div>" +
"<div class=\"spotB3\">" + suit + "</div>" +
"<div class=\"spotC1\">" + suit + "</div>" +
"<div class=\"spotC2\">" + suit + "</div>" +
"<div class=\"spotC4\">" + suit + "</div>" + 
"<div class=\"spotC5\">" + suit + "</div>";
            case "10":
                return "<div class=\"spotA1\">" + suit + "</div>" +
"<div class=\"spotA2\">" + suit + "</div>" +
"<div class=\"spotA4\">" + suit + "</div>" +
"<div class=\"spotA5\">" + suit + "</div>" +
"<div class=\"spotB2\">" + suit + "</div>" +
"<div class=\"spotB4\">" + suit + "</div>" +
"<div class=\"spotC1\">" + suit + "</div>" +
"<div class=\"spotC2\">" + suit + "</div>" +
"<div class=\"spotC4\">" + suit + "</div>" + 
"<div class=\"spotC5\">" + suit + "</div>";
            case "J":
                return "<div class=\"spotB3\">" + "JACK" + "</div>";
            case "Q":
                return "<div class=\"spotB3\">" + "QUEEN" + "</div>";
            case "K":
                return "<div class=\"spotB3\">" + "KING" + "</div>";
            case "A":
                return "<div class=\"spotB3\">" + "ACE" + "</div>";
            default:
                alert("this is not correct suit generation!");
                return "";                
        }
    }
    
    function generateCardHTML(number,suitParam){
        //null argument signifies unknown card to the player, only show card back        
        if(number === null){
             return "<div class=\"card\"></div>";            
        }
        //initialize card html object for non-hidden card
        var cardHtml = "<div class=\"card\">";
        //show the card, and indicate color based on suit
        var suit;
        switch(suitParam){
            case "clubs":
                suit = clubSuit;
                break;
            case "diamonds":
                suit = diamondSuit;
                break;
            case "hearts":
                suit = heartSuit;
                break;
            case "spades":
                suit = spadeSuit;
                break;
            default:
                alert("this suit is not correct!");
        }
        cardHtml += "<div class=\"front " + getColor(suit) + "\">";           
        //suit and number in top left
        cardHtml += "<div class=\"number\">" + number + "<br/>" + suit + "</div>";
        //suit symbols
        cardHtml += generateCardSymbolsHTML(number,suit);
        //close tags and return
        cardHtml += "</div></div>"; //"card" and "front" divs
        return cardHtml;        
    }
    
    function generateHandHTML(cardArray){
        var handHTML = "";
        for(var i = 0; i < cardArray.length; i++){
            handHTML += generateCardHTML(cardArray[i][0],cardArray[i][1]);    
        }
        return handHTML;
    }
    
    _public.generate = function(playerId, cardArray){
         $("#playerSpot_" + playerId + " > .hand").html(generateHandHTML(cardArray));                 
    };
    _public.addCard = function(playerId, card){
         $("#playerSpot_" + playerId + " > .hand").append(generateCardHTML(card[0],card[1]));   
    };
    _public.removeCard = function(playerId, cardIndex){
        $("#playerSpot_" + playerId + " .hand .card:eq(" + cardIndex + ")").remove();    
    };
    
    return _public;    
}();



var generateName = function () {
    var _public = {};    
    _public.generate = function(playerId, name){
         $("#playerSpot_" + playerId + " > .playerName").html(name);   
    };
    
    return _public;    
}();



var generatePoints = function () {
    var _public = {};    
    _public.generate = function(playerId, pointValue){
         $("#playerSpot_" + playerId + " > .playerPoints").html("Points: " + pointValue);   
    };
    
    return _public;    
}();