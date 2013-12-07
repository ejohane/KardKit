var CardHolder = require('./cardHolder');
var util = require("util");

function Hand(cardholder) {
	this.cards = [];
	this.numCards = 0;
}
util.inherits(Hand, CardHolder);

//takes a card of choice and places it in the destination holder
Hand.super_.prototype.play = function(index, destination) {
	var temp = this.cards.splice(index, 1);
	this.numCards = this.numCards - 1;
	destination.insert(temp);
}

if (typeof module !== 'undefined') {
    module.exports = Hand;
}