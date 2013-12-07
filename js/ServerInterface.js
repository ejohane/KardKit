
var ServerInterface = function () {
     var _public = {};
       
     _public.setUIFramework = function(client, a1,a2,a3,a4){
        client.emit("setUIFramework", a1,a2,a3,a4);
     };

    _public.setActions = function(client, actions){
        client.emit("setActions", actions);
     };

     _public.play = function(socket, gameRoom, topCard){
        socket.sockets.in(gameRoom).emit("play", topCard);
     };

    
     return _public;
}();

module.exports = ServerInterface;