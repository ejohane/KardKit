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
//hopefulPlayer is an int used during digging. it corresponds to the player who will earn the pile if the dig fails.
//digChances is an int used during digging.

function RatSlapGame(room){
	//Declare deck & cardholders
	/* Seriously, can you declare multiple objects in the same class as was done in cardHolder.js? */
	var CardHolder = require('./js/cardHolder.js');
	var deck;
	var gameRoom = room;
	var allPlayers = [];
	var playerHands = [];
	var playPile;
	var isSlappable = false;
	var currentPlayer = 0;
	var hopefulPlayer = -1;
	var digChances = 0;
}

//Called when all 4 players are loaded in the game room.
RatSlapGame.prototype.setup = function(){
	deck = new Deck(new cardHolder);
	//Adding players in order???
	for (var i = 0; i < 4; i++){
		playerHands[i] = new Hand(new cardHolder);
	}
	playPile = new PlayPile(new cardHolder);
	
	deck.shuffle();
	deck.cut();
	while (!deck.isEmpty()){
		deck.draw(playerHands[currentPlayer]);
		this.advanceCurrentPlayer();
	}
	currentPlayer = 0;
	for (var i in playerHands){
		playerHands[i].shuffle();
		playerHands[i].cut();
	}
	
	//ClientUI - draw hands
	
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
	
	//ClientUI - draw new card on playpile
	
	isSlappable = true;
	this.advanceCurrentPlayer();
	if (playPile[playPile.numCards - 1].properties.rank == 'A' ||
		playPile[playPile.numCards - 1].properties.rank == 'J' ||
		playPile[playPile.numCards - 1].properties.rank == 'Q' ||
		playPile[playPile.numCards - 1].properties.rank == 'K'){
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
	
	//ClientUI - draw new card
	
	digChances--;
	if (playPile[playPile.numCards - 1].properties.rank == 'A' ||
		playPile[playPile.numCards - 1].properties.rank == 'J' ||
		playPile[playPile.numCards - 1].properties.rank == 'Q' ||
		playPile[playPile.numCards - 1].properties.rank == 'K'){
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
	if (isSlappable && (!playPile.isEmpty)){
		var trulySlappable = this.slappableConditions;
		var slapper = -1;
		
		for (var i in allPlayers){
			if (allPlayers[i].name = player.name){
				slapper = i;
			}
		}
		
		if (slapper != -1){
			if (trulySlappable){
				winPile(slapper);
				currentPlayer = slapper;
			} else {
				burn(slapper);
				burn(slapper);
			}
		}
	}
}

//Called to this game whenever the client sends a 'gameSkip' socket function.
RatSlapGame.prototype.skipAction = function(){
	for (var i in allPlayers){
		disableSkip(allPlayers[i]);
	}
	if (checkWin){
		//ClientUI - redirect to Imgur? Seriously, what are we doing here?
	} else {
		this.advanceCurrentPlayer();
		enablePlay(currentPlayer);
	}
}

//Called internally. Takes the player to disable the appropriate actions for.
RatSlapGame.prototype.disablePlay = function(player){
	//ClientUI - disable the play action for that player
}

RatSlapGame.prototype.disableDig = function(player){
	//ClientUI - disable the dig action for that player
}

RatSlapGame.prototype.disableSkip = function(player){
	//ClientUI - disable the skip action for that player
}

//Called internally. Takes the index number corresponding to the next player (aka currentPlayer)
RatSlapGame.prototype.enablePlay = function(playerIndex){
	if (playerHands[playerIndex]/*is empty*/){
		//ClientUI - enable the play action for that player
	} else {
		//ClientUI - enable the skip action for that player
	}
}

//Called internally. Takes a player index number and number of chances still left to dig.
RatSlapGame.prototype.enableDigForFaceCard = function(playerIndex, digNumber){
	isSlappable = false;
	digChances = digNumber;
	//ClientUI - enable the dig action for that player
}

//Called internally. Takes a player and enables the slap action for them
RatSlapGame.prototype.enableSlap = function(player){
	//ClientUI - enable the slap action for that player
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
	if (!playerHands[burntIndex].isEmpty()){
		playerHands[burntIndex].play(0, playPile);
		
		//ClientUI - update the play pile
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
		if (!playerHands[i].isEmpty()){
			handsLeft++;
		}
	}
	if (handsLeft == 1){
		return true;
	} else {
		return false;
	}
}