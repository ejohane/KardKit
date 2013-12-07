var CardHolder = require('./cardHolder');
var util = require("util");

function Deck(cardholder) {
	this.cards = [];
	this.numCards = 0;
}
util.inherits(Deck, CardHolder);

//takes the card at index 0 of the deck and 
//puts it in the destination holder
Deck.super_.prototype.draw = function(destination) {
	var temp = this.cards.splice(0, 1);
	this.numCards = this.numCards - 1;
	destination.insert(temp);
}

if (typeof module !== 'undefined') {
    module.exports = Deck;
}