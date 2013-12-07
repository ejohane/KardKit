var CardHolder = require('./cardHolder');
var util = require("util");

function PlayPile(cardholder) {
	this.cards = [];
	this.numCards = 0;
}
util.inherits(PlayPile, CardHolder);

//takes all cards from the play pile and puts them in reverse order
//in the destination holder
PlayPile.super_.prototype.empty = function(destination) {
	var temp;
	for (var i = 0; i < this.length; i++) {
		temp = this.cards.pop();
		this.numCards = numCards - 1;
		destination.insert(temp);
	}
}

if (typeof module !== 'undefined') {
    module.exports = PlayPile;
}