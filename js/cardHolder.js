function CardHolder() {
	this = [];
	var numCards = 0;
}

CardHolder.prototype.isEmpty = function() {
	if (this.numCards == 0)
		return true;
	return false;
}

//removes a card from a cardholder and returns that card
CardHolder.prototype.take = function(index) {
	var temp = this[i];
	this.splice(index, 1);
	this.numCards = this.numCards - 1;
	return temp;
}

//puts a card into the end of the cardholder
CardHolder.prototype.insert = function(card) {
	this.push(card);
	this.numCards = this.numCards + 1;
}

//randomly swaps 2 cards places, does this for the total
//number of cards in the holder
CardHolder.prototype.shuffle = function() {
	var source1;
	var source2;
	var temp;
	for (var i = 0; i < this.length; i++) {
		source1 = Math.floor(Math.random()*(this.length-1));
		source2 = Math.floor(Math.random()*(this.length-1));
		temp = this[source1];
		this[source1] = this[source2];
		this[source2] = temp;		
	}
}

//splits the holder in two parts, then joins them together
//with the second half first, followed by the first half
CardHolder.prototype.cut = function() {
	var one = this.slice(0, (this.length/2))
	var two = this.slice((this.length/2)+1);
	this = two.concat(one);
}

function Deck(cardholder) {}

//takes the card at index 0 of the deck and 
//puts it in the destination holder
Deck.prototype.draw = function(destination) {
	var temp = this.splice(0, 1);
	this.numCards = this.numCards - 1;
	destination.insert(temp);
}

function Hand(cardholder) {}

//takes a card of choice and places it in the destination holder
Hand.prototype.play = function(index, destination) {
	var temp = this.splice(index, 1);
	this.numCards = this.numCards - 1;
	destination.insert(temp);
}

function PlayPile(cardholder) {}

//takes all cards from the play pile and puts them in reverse order
//in the destination holder
PlayPile.prototype.empty = function(destination) {
	var temp;
	for (int i = 0; i < this.length; i++) {
		temp = this.pop();
		this.numCards = numCards - 1;
		destination.insert(temp);
	}
}