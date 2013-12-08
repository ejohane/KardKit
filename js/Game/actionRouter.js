var actionRouter = function () {
        var _public = {};
        
        /*private
        ---------------------------------------------*/
       function playerHasAction(actionName){
           var actionElement = $("#" + actionName);
           return actionElement.length > 0 ; //does this element appear in actionbar ?
       } 
  
      _public.processAction = function(actionName){
         if(playerHasAction(actionName)){
             switch(actionName){
               case "play":           
                guiInterface.action_play();
                break;
              case "slap":
                guiInterface.action_slap();
                break;
              case "draw":
                guiInterface.action_draw();
                break;
	      case "takeCard":
                guiInterface.action_takeCard();
                break;
              case "quit":
	        guiInterface.action_quit();
	        break;	
              default:
                alert("this action doesn't exist!");
            }
         }
      };  
  
      return _public;

    }();
