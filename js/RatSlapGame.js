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
//slapAllowed is a boolean that determines whether or not the play pile is actually slappable at the current time
//currentPlayer is an int corresponding to the player whose turn it is
//hopefulPlayer is an int used during digging. it corresponds to the player who will earn the pile if the dig fails.
//digChances is an int used during digging.

var CardHolder = require('./cardHolder.js');
var StandardDeck = require('./StandardDeck.js');
var Deck = require('./deck.js');
var Hand = require('./hand.js');
var PlayPile = require('./playPile.js');

function RatSlapGame(room){
	//Declare deck & cardholders
	/* Seriously, can you declare multiple objects in the same class as was done in cardHolder.js? */
	this.deck;
	this.gameRoom = room;
	this.allPlayers = [];
	this.playerHands = [];
	this.playPile;
	this.slapAllowed = false;
	this.currentPlayer = 0;
	this.pastPlayer = -1;
	this.hopefulPlayer = -1;
	this.digChances = 0;

	//Actions
	this.completeActionlistNames = ["slap","play"];
	this.completeActionlistLabels = ["SLAP","Play"];
	this.completeActionlistKeyCodes = [32,112];
	this.completeActionlistKeyLabels = ["S","P"];
	this.actionsToGive = [1,1];

	//Tracking player actions
	this.playEnabledArray = [0, 0, 0, 0];
	this.slapEnabledArray = [1, 1, 1, 1];

	//Tracking player mapping
	this.trackingPlayersArray = [[0, 1, 2, 3],
				[3, 0, 1, 2],
				[2, 3, 0, 1],
				[1, 2, 3, 0]];
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
	
	slapAllowed = true;
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
	
	slapAllowed = true;

	if (currentPlayer = pastPlayer && !slappableConditions){
		//win
	} else {
		if (digChances == 0){	
			if (playPile[playPile.numCards - 1].properties.rank == 'A' ||
				playPile[playPile.numCards - 1].properties.rank == 'J' ||
				playPile[playPile.numCards - 1].properties.rank == 'Q' ||
				playPile[playPile.numCards - 1].properties.rank == 'K'){
					slapAllowed = false;
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
	if (slapAllowed && (!playPile.isEmpty)){
		var trulySlappable = this.isSlappable();
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
	playEnabledArray[player] = 0;
}

//Called internally. Takes the index number corresponding to the next player (aka currentPlayer)
RatSlapGame.prototype.enablePlay = function(playerIndex){
	playEnabledArray[player] = 1;
}

//Called internally. Takes a player and enables the slap action for them
RatSlapGame.prototype.enableSlap = function(player){
	slapEnabledArray[player] = 1;
}

//Called internally. Advances the current player, but loops when it would be 4.
RatSlapGame.prototype.advanceCurrentPlayer = function(shouldSkip){
	var temp = currentPlayer;
	currentPlayer++;
	if (currentPlayer >= 4){
		currentPlayer = 0;
	}
	if (shouldSkip) {
		if (playerHands[currentPlayer].isEmpty()){
			advanceCurrentPlayer();
		} else {
			pastPlayer = temp;
		}
	}
}

//Called internally. Takes the player index of the burned player.
RatSlapGame.prototype.burn = function(burntIndex){
	if (!playerHands[burntIndex].isEmpty()){
		playerHands[burntIndex].play(0, playPile);
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

RatSlapGame.prototype.getCardsByPlayer = function(id){
	var cbh = -1;
	for (var i in allPlayers){
		if (id = allPlayers[i].id || id = allPlayers[i].gameID){
			cbh = playerHands[i];
		}
	}
	return cbh;
}

RatSlapGame.prototype.getActionsByPlayer = function(id){
	var gabp = [0, 0]
	for (var i in allPlayers){
		if (id = allPlayers[i].id || id = allPlayers[i].gameID){
			gabp[0] = playEnabledArray[i];
			gabp[1] = slapEnabledArray[i];
		}
	}
	return gabp;
}

RatSlapGame.prototype.getTrackingNumByPlayer = function(id1, id2){
	var viewer = -1;
	var target = -1;
	var trackingNum = -1;
	for (var i in allPlayers){
		if (id1 = allPlayers[i].id || id1 = allPlayers[i].gameID){
			viewer = i;
		}
		if (id2 = allPlayers[i].id || id2 = allPlayers[i].gameID){
			target = i;
		}
	}
	trackingNum = trackingPlayersArray[viewer][target];
}

// Called internally. Checks against all the winning conditions for slapping the pile.
RatSlapGame.prototype.isSlappable = function() {
	// The top 4 cards' ranks
	var first = playPile[playPile.numCards - 1].properties.rank;
	var second = playPile[playPile.numCards - 2].properties.rank;
	var third = playPile[playPile.numCards - 3].properties.rank;
	var fourth = playPile[playPile.numCards - 4].properties.rank;

	// Double: Top 2 cards are the same rank
	if (first === second) {
		return true;
	}
	// Sandwich: Top card and the second card beneath it are the same rank. (eg. Q 7 Q)
	if (first === third) {
		return true;
	}
	// Bottoms Up: Top card and the bottom card match rank.
	if (first === playPile[0].properties.rank) {
		return true;
	}
	// Tens: When consecutive cards (or cards with a face card in between) total 10 (e.g. 4, 6 or 3, K, 7)
	if (first + second === 10
		|| ((second === 'J' || second === 'Q' || second === 'K') && first + third === 10)) {
		return true;
	}
	// Four in a Row: The last four cards were in sequence (eg. 4, 5, 6, 7)
	if (fourth - 1 === third && third - 1 === second && second - 1 === first) {
		return true;
	}
	// Marriage: If the last two cards are a queen and a king.
	if (first === 'K' && second === 'Q' || first === 'Q' && second === 'K') {
		return true;
	}
	return false;
}

module.exports = RatSlapGame;
