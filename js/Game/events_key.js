var enteringOutboxMessage = false;
    $("#outbox").focus(function () {
        enteringOutboxMessage = true;
    });
    $("#outbox").blur(function () {
        enteringOutboxMessage = false;
    });

    var enteringDebugInfo = false;
    $("#sandbox input").focus(function () {
        enteringDebugInfo = true;
    });
    $("#sandbox input").blur(function () {
        enteringDebugInfo = false;
    });

    var implementKeypress = function () {
        var _public = {};
        var enterKeyCode = 13;
        /*private
        -------------------------------------------------*/
        function getActionNameByKeycode(keyCode){
          for(var i = 0; i < ACTION_KEY_CODES.length; i++){
            if(ACTION_KEY_CODES[i] === keyCode){
              return ACTION_NAMES[i];
            }
          }
        }
        
        _public.handle = function(keyCode){            
            if(enteringDebugInfo){ 
                return; 
            }            
            else if(enteringOutboxMessage){       
                if(keyCode === enterKeyCode){                    
                    guiInterface.sendOutboxMessage();                    
                }
            }else{ //default keypress handling, assume they want to activate actionbar action
               var actionName = getActionNameByKeycode(keyCode);               
               actionRouter.processAction(actionName); 
            }
        };
    
        return _public;
    }();

    $(document).keypress(function(event) {	    
        implementKeypress.handle(event.which);                  
    });