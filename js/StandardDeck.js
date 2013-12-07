var Card = require('./Card.js');
var util = require("util");
var CardHolder = require('./CardHolder.js');

function StandardDeck() {
	//var cards = [];
	var cardHolder = new CardHolder();
	var suits = new Array("C","D","H","S");
	var n = 52;

	for (var i = 0; i < suits.length; i++) {
		for (var j = 1; j < n/suits.length+1; j++) {
			var c = new Card();
			c.setId(13*i+j);
			c.properties.suit = suits[i];
			if (j === 1) { c.properties.rank = 'A'; }
			else if (j === 11) { c.properties.rank = 'J'; }
			else if (j === 12) { c.properties.rank = 'Q'; }
			else if (j === 13) { c.properties.rank = 'K'; }
			else { c.properties.rank = j; }
			//cards.push(c);
			cardHolder.insert(c);
		}
	}

	return cardHolder;
}

// Set up the inheritance
util.inherits(StandardDeck, CardHolder);

StandardDeck.super_.prototype.toString = function() {
	for (var x in this.cards) {
		if (x % 13 === 0) { console.log('\n'); }
		process.stdout.write(this.cards[x].properties['suit'] + this.cards[x].properties['rank'] + ' ');
	}
	process.stdout.write("\n");
}

// Make it a node module
if (typeof module !== 'undefined') {
    module.exports = StandardDeck;
}