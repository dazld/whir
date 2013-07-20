var Backbone = require('backbone'),
	Q = require('q')
	bus = require('./bus'),
	path = require('path'),
	U = require('url'),
	hb = require('handlebars');


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
	this.bus.subscribe('app.templates',this.addTemplates.bind(this));
	this.bus.subscribe('request.in', this.handleBuildRequest.bind(this));
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

PageFactory.prototype.handleBuildRequest = function(options){

	var bus = this.bus;
	
	
	
	var url = path.normalize(options.url).split('/');

	if (url.join('/') !== options.url){
		options.res.redirect(url.join('/'));
	} else {
		this.build(url,options.uuid).then(function(result){
			options.res.send(result);
		}, function(error){
			bus.publish('app.debug',error);
		}).done(function(){
			var duration = Date.now()-options.time;
			bus.publish('app.debug','Done building in '+duration+' ms');
			
		});
	}
};

// build function, returning a promise to the built page
PageFactory.prototype.build = function build(url,uuid) {

	var buildingPage = Q.defer();

	

	if (this.routes[url[1]]) {
		
		var controller = url[1];
		var action = url[2];
		
		var requestInstance = new this.routes[controller].instance.constructor(url,this.templates,uuid);
		

		var output = requestInstance[action].apply(requestInstance);
		buildingPage.resolve(output);
	};

	

	

	//

	return buildingPage.promise;



};

module.exports = PageFactory;