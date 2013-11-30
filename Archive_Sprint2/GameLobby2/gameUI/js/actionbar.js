////////////////////////////////////////////////////////

//         

//                   actionbar .js

//

//////////////////////////////////////////////////////

    
    //_______________________________________________ 
    // This renders the actionbar once it receives the argument from 
    //  the server on which actions to give the player 
    //______________________________________________
    
    var createActionbar = function () {
      var _public = {};

    //private
      function setWidthOfActionbarGivenActions(actionCount){    
        if(actionCount === 0){
          $("#actionbar").addClass("hide");
        }else {
          var widthForActionDivs = actionCount * 100;
          var paddedWidth = actionCount * 5;
          $("#actionbar").css("width",(widthForActionDivs + paddedWidth));  
        }    
      }
  
    function addActionToActionbar(index){
      var divElement = document.createElement("div");
      //create the key label for the action      
      divElement.id = ACTION_NAMES[index];
      divElement.className = 'action';
      var spanElementKeyLabel = document.createElement("span");
      spanElementKeyLabel.innerHTML = ACTION_KEY_LABELS[index];
      divElement.appendChild(spanElementKeyLabel);  
      divElement.appendChild(document.createElement("br"));
      //create the action label    
      var spanElementActionLabel = document.createElement("span");
      spanElementActionLabel.innerHTML = ACTION_LABELS[index];  
      divElement.appendChild(spanElementActionLabel);     
      //add action to bar
      var parent = document.getElementById("actionbar");
      parent.appendChild(divElement);  
    }
  
    //public
    _public.create = function(actionsToGive){
      $("#actionbar").html("");
      var actionCount = 0;  
      for(var i = 0; i < actionsToGive.length;i++){
        if(actionsToGive[i] == 1){
           addActionToActionbar(i); 
           actionCount++;
        }
      }
      setWidthOfActionbarGivenActions(actionCount);
    };

      return _public;

    }();  