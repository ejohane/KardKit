/*
 * Returns a standard playing card deck, Ace through King of four suits without the Jokers, inside a CardHolder.
 */

var Card = require('./Card.js');
var CardHolder = require('./CardHolder.js');

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

/*for (var x in cardHolder.cards) {
	if (x % 13 === 0) { console.log('\n'); }
	process.stdout.write(cardHolder.cards[x].properties['suit'] + cardHolder.cards[x].properties['rank'] + ' ');
}
process.stdout.write("\n");*/

return cardHolder;