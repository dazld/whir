var Backbone = require('backbone'),
	Q = require('q')
	bus = require('./bus');


var PageFactory = function PageFactory(options) {

	this.startListening();

	this.bus.publish('core.module', {
		module: "PageFactory"
	});

};

// mixin the main app bus
PageFactory.prototype.bus = bus;

// setup listeners for incoming build events
PageFactory.prototype.startListening = function startListening() {
	this.bus.subscribe('request.in', this.build.bind(this));
};

// bulk compiled template add
PageFactory.prototype.addTemplates = function(templates) {
	this.templates = templates;
}

// bulk route add 
PageFactory.prototype.addRoutes = function(routes) {
	this.routes = routes;
};

// build function, returning a promise to the built page
PageFactory.prototype.build = function build(options) {


	var building = Q.defer();

	//

	return building;



};

module.exports = PageFactory;