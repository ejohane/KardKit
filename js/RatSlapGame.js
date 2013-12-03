////////////////////////
//	RatSlapGame.js
//	by Ben Jaberg
//	Last Revision: 12/3/2013
////////////////////////

//Variables
//gameRoom is the socket room containing our players
//allPlayers[] is an array of all the players gained from the gameRoom 
//playerHands[] is an array of Hands, where the index corresponds to the appropriate player in allPlayers[]
//playPile is the center stack of cards
//deck is the deck of cards- only exists during initial setup
//isSlappable is a boolean that determines whether or not the play pile is actually slappable at the current time
//currentPlayer is an int corresponding to the player whose turn it is

function RatSlapGame(room){
	var StandardDeck = require('./StandardDeck.js');
	//Declare deck & cardholders
	/* Seriously, can you declare multiple objects in the same class as was done in cardHolder.js? */
	var gameRoom = room;
	var isSlappable = false;
	var currentPlayer = 0;
	var hopefulPlayer = -1;
	var digChances = 0;
}

//Called when all 4 players are loaded in the game room.
RatSlapGame.prototype.setup = function(){
	deck.shuffle();
	deck.cut();
	//deal cards out
	/* how to check if deck is empty? */
	isSlappable = true;
	for (var i in allPlayers){
		enableSlap(allPlayers[i]);
	}
	enablePlay(currentPlayer);
}

//Called to this game whenever the client sends a 'gamePlayCard' socket function.
RatSlapGame.prototype.playAction = function(){
	for (var i in allPlayers){
		disablePlay(allPlayers[i]);
	}
	playerHands[currentPlayer].play(0, playPile);
	isSlappable = true;
	this.advanceCurrentPlayer();
	if (playPile[playPile.length - 1].properties.rank == 'A' ||
		playPile[playPile.length - 1].properties.rank == 'J' ||
		playPile[playPile.length - 1].properties.rank == 'Q' ||
		playPile[playPile.length - 1].properties.rank == 'K'){
			enableDigForFaceCard(currentPlayer, 3);
	} else {
		enablePlay(currentPlayer);
	}
}

//Called to this game whenever the client sends a 'gameDigFaceCard' socket function.
RatSlapGame.prototype.digAction = function(){
	for (var i in allPlayers){
		disableDig(allPlayers[i]);
	}
	playerHands[currentPlayer].play(0, playPile);
	digChances--;
	if (playPile[playPile.length - 1].properties.rank == 'A' ||
		playPile[playPile.length - 1].properties.rank == 'J' ||
		playPile[playPile.length - 1].properties.rank == 'Q' ||
		playPile[playPile.length - 1].properties.rank == 'K'){
			this.advanceCurrentPlayer();
			enablePlay(currentPlayer);
	} else if (digChances == 0) {
		winPile(hopefulPlayer);
		currentPlayer = hopefulPlayer;
		enablePlay(currentPlayer);
	} else {
		enableDigForFaceCard(currentPlayer, digChances);
	}
}

//Called to this game whenever the client sends a 'gameSlap' socket function.
RatSlapGame.prototype.slapAction = function(player){
	if (isSlappable /*&& !playPile.isEmpty*/ ){
		var trulySlappable = this.slappableConditions;
		//figure out who sent the slap action based on the player in the arguements
		//Pass it along in a variable called slapper as an int
		if (trulySlappable){
			winPile(slapper);
			currentPlayer = slapper;
		} else {
			burn(slapper);
			burn(slapper);
		}
	}
}

//Called to this game whenever the client sends a 'gameSkip' socket function.
RatSlapGame.prototype.skipAction = function(){
	for (var i in allPlayers){
		disableSkip(allPlayers[i]);
	}
	if (checkWin){
		//what do when over?
	} else {
		this.advanceCurrentPlayer();
		enablePlay(currentPlayer);
	}
}

//Called internally. Takes the player to disable the appropriate actions for.
RatSlapGame.prototype.disablePlay = function(player){
	//disable the play action for that player
}

RatSlapGame.prototype.disableDig = function(player){
	//disable the dig action for that player
}

RatSlapGame.prototype.disableSkip = function(player){
	//disable the skip action for that player
}

//Called internally. Takes the index number corresponding to the next player (aka currentPlayer)
RatSlapGame.prototype.enablePlay = function(playerIndex){
	if (playerHands[playerIndex]/*is empty*/){
		//enable the play action for that player
	} else {
		//enable the skip action for that player
	}
}

//Called internally. Takes a player index number and number of chances still left to dig.
RatSlapGame.prototype.enableDigForFaceCard = function(playerIndex, digNumber){
	isSlappable = false;
	digChances = digNumber;
	//enable the dig action for that player
}

//Called internally. Takes a player and enables the slap action for them
RatSlapGame.prototype.enableSlap = function(player){
	//enable the slap action for that player
}

//Called internally. Advances the current player, but loops when it would be 4.
RatSlapGame.prototype.advanceCurrentPlayer = function(){
	currentPlayer++;
	if (currentPlayer >= 4){
		currentPlayer = 0;
	}
}

//Called internally. Takes the player index of the burned player.
RatSlapGame.prototype.burn = function(burntIndex){
	if (playerHands[burntIndex]/*is not empty*/){
		playerHands[burntIndex].play(0, playPile);
	}
}

//Called internally. Takes the player index of the player to win the pile.
RatSlapGame.prototype.winPile = function(winIndex){
	playPile.empty(playerHands[winIndex]);
}

//Called internally. Checks and returns true if only one player still has a hand.
RatSlapGame.prototype.checkWin = function(){
	var handsLeft = 0;
	for (var i in playerHands){
		if (playerHands[i]/*is not empty*/){
			handsLeft++;
		}
	}
	if (handsLeft == 1){
		return true;
	} else {
		return false;
	}
}