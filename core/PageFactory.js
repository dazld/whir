var Backbone = require('backbone'),
	Q = require('q')
	bus = require('./bus');


var PageFactory = function PageFactory(options) {
	
	this.startListening();
	
	this.bus.publish('core.module', {
		module: "PageFactory"
	});

};

PageFactory.prototype.bus = bus;

PageFactory.prototype.startListening = function startListening() {

	var Building = Q.promised(this.build);

	this.bus.subscribe('request.in', this.build.bind(this));
};

PageFactory.prototype.build = function build(options) {
	

	var building = Q.defer();
	
	//
	
	return building;
};

module.exports = PageFactory;