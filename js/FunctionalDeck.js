var Card = require('./Card.js');

var cards = [];
var c = new Card();
c.properties.effect = function () {
	//process.stdout.write('function hit');
	return 'function hit\n';
}
cards.push(c);

console.log(cards[0].properties.effect);
process.stdout.write(cards[0].properties.effect());