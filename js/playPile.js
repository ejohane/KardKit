var CardHolder = require('./cardHolder.js');
var util = require("util");

function PlayPile(cardholder) {
	this.cards = cardholder.cards;
}
util.inherits(PlayPile, CardHolder);

//takes all cards from the play pile and puts them in reverse order
//in the destination holder
PlayPile.super_.prototype.empty = function(destination) {
	var temp;
	var howMany = this.cards.length;
	for (var i = 0; i < howMany; i++) {
		temp = this.cards.pop();
		destination.insert(temp);
	}
	//console.log(this.cards);
}

if (typeof module !== 'undefined') {
    module.exports = PlayPile;
}