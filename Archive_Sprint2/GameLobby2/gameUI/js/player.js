////////////////////////////////////////////////////////

//         

//                  player Names .js

//

//////////////////////////////////////////////////////

var generateName = function () {
    var _public = {};    
    _public.generate = function(playerId, name){
         $("#playerSpot_" + playerId + " > .playerName").html(name);   
    };
    
    return _public;    
}();



////////////////////////////////////////////////////////

//         

//                  player Points .js

//

//////////////////////////////////////////////////////

var generatePoints = function () {
    var _public = {};    
    _public.generate = function(playerId, pointValue){
         $("#playerSpot_" + playerId + " > .playerPoints").html("Points: " + pointValue);   
    };
    
    return _public;    
}(); 