/******************************************************************************************
    Create By: Erik Johansson
    Last Updated: 11/18/2013 
******************************************************************************************/

function Room(name, id, owner) {
  this.name = name;
  this.id = id;
  this.owner = owner;
  this.people = [];
  this.peopleLimit = 28;
  this.status = "Open";
  this.private = false;
  this.password;
  this.invited = [];
  this.RatSlapGame = null;
};


Room.prototype.addPerson = function(personID) {
  if (this.status === "Open" && this.people.length + 1 <= this.peopleLimit) {
    this.people.push(personID);
	personID.setRoom(this);
  }else if((this.people.length + 1) == this.peopleLimit){
    this.status = "closed";
  }
};

Room.prototype.removePerson = function(person) {
  var personIndex = -1;
  for(var i = 0; i < this.people.length; i++){
    if(this.people[i].id === person.id){
      playerIndex = i;
      break;
    }
  }
  this.people.remove(personIndex);
};

Room.prototype.getPerson = function(personID) {
  var person = null;
  for(var i = 0; i < this.people.length; i++) {
    if(this.people[i].id == personID) {
      person = this.people[i];
      break;
    }
  }
  return person;
};

Room.prototype.isAvailable = function() {
  if (this.available === "open") {
    return true;
  } else {
    return false;
  }
};

Room.prototype.isPrivate = function() {
  if (this.private) {
    return true;
  } else {
    return false;
  }
};

Room.prototype.setGame = function(game) {
	this.RatSlapGame = game;
}

Room.prototype.getGame = function(){
	return this.RatSlapGame;
}

Room.prototype.isGameRoom = function(){
	if (this.RatSlapGame == null){
		return false;
	} else {
		return true;
	}
}


module.exports = Room;