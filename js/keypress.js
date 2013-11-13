////////////////////////////////////////
//     handle keypress events
/////////////////////////////////////////


    var enteringOutboxMessage = false;
    $("#outbox").focus(function () {
        enteringOutboxMessage = true;
    });
    $("#outbox").blur(function () {
        enteringOutboxMessage = false;
    });

    var implementKeypress = function () {
        var _public = {};
        var enterKeyCode = 13;

        function getActionNameByKeycode(keyCode){
          for(var i = 0; i < actionKeyCodes.length; i++){
            if(actionKeyCodes[i] === keyCode){
              return actionNames[i];
            }
          }
        }
      
        function playerHasAction(actionName){
           var actionElement = $("#" + actionName);
           return actionElement.length > 0 ; //does this element appear in actionbar ?
        }

        _public.handle = function(keyCode){            
            //handle user entering or sending a message
            if(enteringOutboxMessage){       
                if(keyCode === enterKeyCode){                    
                    guiInterface.sendOutboxMessage();                    
                }
            }else{ //default keypress handling, assume they want to activate actionbar action
               var actionName = getActionNameByKeycode(keyCode);       
               if(playerHasAction(actionName)){
                 implementActions.doAction(actionName);
               }else{ 
                   alert('not an action in your action set!');
               } 
            }
        };
    
        return _public;
    }();

    $(document).keypress(function(event) {
        implementKeypress.handle(event.which);                  
    });
