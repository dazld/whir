var Backbone = require('backbone'),
	Q = require('q')
	bus = require('./bus'),
	U = require('url');


var PageFactory = function PageFactory(options) {

	this.startListening();
	this.routes = {};
	this.bus.publish('core.module', {
		module: "PageFactory"
	});

};

// link to the main app bus
PageFactory.prototype.bus = bus;

// setup listeners for incoming events
PageFactory.prototype.startListening = function startListening() {
	this.bus.subscribe('app.routes', this.addRoutes.bind(this));
	this.bus.subscribe('request.in', this.build.bind(this));
};

// bulk compiled template add
PageFactory.prototype.addTemplates = function(templates) {
	this.templates = templates;
}

// bulk route add 
PageFactory.prototype.addRoutes = function(routes) {
	// this.routes = this.routes.concat(routes);
	this.routes[routes.name] = routes;
	
	
};

// build function, returning a promise to the built page
PageFactory.prototype.build = function build(options) {


	var url = options.url.split('/');

	

	if (this.routes[url[1]]) {
		var controller = url[1];
		var action = url[2];
		var output = this.routes[controller].instance[action](options.req,options.res);
		options.res.send(output);
	};

	

	var building = Q.defer();

	//

	return building;



};

module.exports = PageFactory;