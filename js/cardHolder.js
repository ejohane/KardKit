var util = require("util");

function CardHolder() {
	this.cards = [];
	this.numCards = 0;
};

CardHolder.prototype.isEmpty = function() {
	if (this.numCards == 0)
		return true;
	return false;
}

//removes a card from a cardholder and returns that card
CardHolder.prototype.take = function(index) {
	var temp = this.cards[i];
	this.cards.splice(index, 1);
	this.numCards = this.numCards - 1;
	return temp;
}

//puts a card into the end of the cardholder
CardHolder.prototype.insert = function(card) {
	this.cards.push(card);
	this.numCards = this.numCards + 1;
}

//randomly swaps 2 cards places, does this for the total
//number of cards in the holder
CardHolder.prototype.shuffle = function() {
	var source1;
	var source2;
	var temp;
	for (var i = 0; i < this.cards.length; i++) {
		source1 = Math.floor(Math.random()*(this.cards.length-1));
		source2 = Math.floor(Math.random()*(this.cards.length-1));
		temp = this.cards[source1];
		this.cards[source1] = this.cards[source2];
		this.cards[source2] = temp;		
	}
}

//splits the holder in two parts, then joins them together
//with the second half first, followed by the first half
CardHolder.prototype.cut = function() {
	var one = this.cards.slice(0, (this.cards.length/2))
	var two = this.cards.slice((this.cards.length/2)+1);
	this.cards = two.concat(one);
}

function Deck(cardholder) {}
util.inherits(Deck, CardHolder);

//takes the card at index 0 of the deck and 
//puts it in the destination holder
Deck.super_.prototype.draw = function(destination) {
	var temp = this.cards.splice(0, 1);
	this.numCards = this.numCards - 1;
	destination.insert(temp);
}

function Hand(cardholder) {}
util.inherits(Hand, CardHolder);

//takes a card of choice and places it in the destination holder
Hand.super_.prototype.play = function(index, destination) {
	var temp = this.cards.splice(index, 1);
	this.numCards = this.numCards - 1;
	destination.insert(temp);
}

function PlayPile(cardholder) {}
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
    module.exports = CardHolder;
}