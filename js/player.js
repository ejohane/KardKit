/******************************************************************************************
    Create By: Erik Johansson
    Last Updated: 11/18/2013 
******************************************************************************************/
function Player(name, id) {
  this.name = name;
  this.id = id;
  this.rooms = [];
  var status = "Ready"
  this.inGame = false;
  this.room ;
  this.invitedGame;
  this.gameID;
};

Player.prototype.getRoomName = function(){
	//return this.room;
	if(!this.inGame){
		return "none";	
	} 
	else{
		var gameRoom = this.rooms[1];
		return gameRoom.name;
	}
};

Player.prototype.setRoom = function(room){
	this.room = room;
};

Player.prototype


module.exports = Player;