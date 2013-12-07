
var ServerInterface = function () {
     var _public = {};

        
     _public.setUIFramework = function(client, a1,a2,a3,a4){
        client.emit("setUIFramework", a1,a2,a3,a4);
     }
    
     return _public;
}();

module.exports = ServerInterface;