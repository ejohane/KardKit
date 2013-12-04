$(document).on("click", ".card", function () {
     cardSelection.select(this);    
 });

$("#actionbar").on("click",".action", function() {
    var actionName = $(this).attr("id");
     actionRouter.processAction(actionName);
});