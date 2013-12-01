function Card() {
	this.id;
	this.properties = {};
}

Card.prototype.setId = function(value) {
	this.id = value;
}

Card.prototype.getId = function() {
	return this.id;
}

Card.prototype.addProperty = function(key, value) {
	this.properties.set(key, value);
}

Card.prototype.getProperty = function(key) {
	return this.properties.get(key);
}

// Make it a NodeJS module.
if (typeof module !== 'undefined') {
    module.exports = Card;
}