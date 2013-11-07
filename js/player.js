function Player(name, id) {
  this.name = name;
  this.id = id;
  this.rooms = [];
  var status = "Ready"
  this.inGame = false;
  this.room = "";
  this.invitedGame;
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


module.exports = Player;