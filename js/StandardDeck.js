var Card = require('./Card.js');
var CardHolder = require('./CardHolder.js');

//var cards = [];
var cards = new CardHolder();
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
		cards.insert(c);
	}
}

/*for (var x in cards) {
	if (x % 13 === 0) { console.log('\n'); }
	process.stdout.write(cards[x].properties['suit'] + cards[x].properties['rank'] + ' ');
}
process.stdout.write("\n");*/

return cards;