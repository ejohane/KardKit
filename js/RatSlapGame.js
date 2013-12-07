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
	this.CardHolder = require('./cardHolder.js');
	this.deck;
	this.gameRoom = room;
	this.allPlayers = [];
	this.playerHands = [];
	this.playPile;
	this.isSlappable = false;
	this.currentPlayer = 0;
	this.pastPlayer = -1;
	this.hopefulPlayer = -1;
	this.digChances = 0;

	//Actions
	this.completeActionlistNames = ["play", "slap"];
	this.completeActionlistLabels = ["PLAY", "SLAP"];
	this.completeActionlistKeyCodes = [112, 32];
	this.completeActionlistKeyLabels = ["P","S"];
	this.actionsToGive = [1,1];
};


//Called when all 4 players are loaded in the game room.
RatSlapGame.prototype.setup = function(){
	deck = new Deck(new StandardDeck);
	//We add the players in a random order, considering that we need to have 4 people in the room to call setup

	var tempPlayerHolder = gameRoom.people;
	var tempPlayerCounter = 0;
	while (tempPlayerHolder.length != 0){
		var source1;
		source1 = Math.floor(Math.random() * (tempPlayerHolder.length - 1));
		if (source1 > -1){
			allPlayers[tempPlayerCounter] = tempPlayerHolder[source1];
			tempPlayerCounter++;
			tempPlayerHolder.splice[source1, 1];
		}
	}

	//ClientUI - add players in order

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

	if (currentPlayer = pastPlayer && !slappableConditions){
		//win
	} else {
		if (digChances == 0){	
			isSlappable = true;
			if (playPile[playPile.numCards - 1].properties.rank == 'A' ||
				playPile[playPile.numCards - 1].properties.rank == 'J' ||
				playPile[playPile.numCards - 1].properties.rank == 'Q' ||
				playPile[playPile.numCards - 1].properties.rank == 'K'){
					isSlappable = false;
					digChances = 3;
					hopefulPlayer = currentPlayer;
					this.advanceCurrentPlayer();
					enablePlayer(currentPlayer);			
			} else {
				this.advanceCurrentPlayer();
				enablePlay(currentPlayer);
			}
		} else {
			digChances--;
			if (playPile[playPile.numCards - 1].properties.rank == 'A' ||
				playPile[playPile.numCards - 1].properties.rank == 'J' ||
				playPile[playPile.numCards - 1].properties.rank == 'Q' ||
				playPile[playPile.numCards - 1].properties.rank == 'K'){
					this.advanceCurrentPlayer();
					enablePlayer(currentPlayer);
			} else if (digChances == 0){
				winPile(hopefulPlayer);
				currentPlayer = hopefulPlayer;
				enablePlay(currentPlayer);
			} else {
				enablePlay(currentPlayer);
			}
		}
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

//Called internally. Takes the player to disable the appropriate actions for.
RatSlapGame.prototype.disablePlay = function(player){
	//ClientUI - disable the play action for that player
}

//Called internally. Takes the index number corresponding to the next player (aka currentPlayer)
RatSlapGame.prototype.enablePlay = function(playerIndex){
	if (playerHands[playerIndex]/*is empty*/){
		//ClientUI - enable the play action for that player
	} else {
		//ClientUI - enable the skip action for that player
	}
}

//Called internally. Takes a player and enables the slap action for them
RatSlapGame.prototype.enableSlap = function(player){
	//ClientUI - enable the slap action for that player
}

//Called internally. Advances the current player, but loops when it would be 4.
RatSlapGame.prototype.advanceCurrentPlayer = function(){
	var temp = currentPlayer;
	currentPlayer++;
	if (currentPlayer >= 4){
		currentPlayer = 0;
	}

	if (playerHands[currentPlayer].isEmpty()){
		advanceCurrentPlayer();
	} else {
		pastPlayer = temp;
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

RatSlapGame.prototype.topCard = function(){
	var tc = [playPile.cards[playPile.numCards-1].properties.rank, playPile.cards[playPile.numCards-1].properties.suit];
	return tc;
}

module.exports = RatSlapGame;
