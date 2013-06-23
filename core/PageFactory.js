var Backbone = require('backbone'),
	Q = require('q')
	bus = require('./bus');


var PageFactory = function PageFactory(options) {
	var args = Array.prototype.slice.call(arguments);
	this.startListening();
	this.bus.publish('pagefactory.instanced', {

	});
};

PageFactory.prototype.bus = bus;

PageFactory.prototype.startListening = function startListening() {
	this.bus.subscribe('request.in', this.build.bind(this));
};

PageFactory.prototype.build = function build(options) {
	console.log(options);
	
	var building = Q.defer();
	
	return building;
};

module.exports = PageFactory;