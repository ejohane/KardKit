var cardPile = function () {
    var _public = {};
    
    _public.set = function(cardHtml){
         $("#cardPile").html("");
		 $("#cardPile").html(cardHtml);
    };
    _public.empty = function(){
         $("#cardPile").html("");
    };
    
    return _public;    
}();