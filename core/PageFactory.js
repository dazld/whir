var Backbone = require('backbone'),
	Q = require('q')
	bus = require('./bus'),
	path = require('path'),
	U = require('url'),
	hb = require('handlebars'),
	postal = require('postal'),
	RequestModel = require('./models/request-model'),
	sandbox = require('./helpers/sandboxer');

var PageFactory = function PageFactory(options) {

	hb.registerHelper('original', function() {
		return new hb.SafeString('<p>' + this.uuid + '</p>');
	});

	this.startListening();
	this.routes = {};
	this.views = {};
	this.bus.publish('core.module', {
		module: "PageFactory"
	});

};

// link to the main app bus
PageFactory.prototype.bus = bus;

// setup listeners for incoming events
PageFactory.prototype.startListening = function startListening() {
	this.bus.subscribe('app.routes', this.addRoutes.bind(this));
	this.bus.subscribe('app.templates', this.addTemplates.bind(this));
	this.bus.subscribe('app.views', this.addView.bind(this));
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

// single view add 
PageFactory.prototype.addView = function(view) {
	// this.routes = this.routes.concat(routes);
	this.views[view.prototype.name] = view;

};

PageFactory.prototype.handleBuildRequest = function(options) {

	var bus = this.bus;
	var uuid = options.uuid;

	// build model from request headers and data
	var requestData = new RequestModel({
		url: options.req.url,
		headers: options.req.headers,
		cookies: options.req.cookies,
		uuid: uuid
	});

	console.log(requestData.toJSON());

	

	



	var url = path.normalize(options.url).split('/');

	if (url[2] && url[2][0] === '_') {
		bus.publish('app.debug',{
			msg: 'redirecting from',
			url: url
		});
		options.res.redirect(url[0]+'/');
	};

	if (url.join('/') !== options.url) {
		options.res.redirect(url.join('/'));
	} else {
		this.build(url, uuid, requestData).then(function(result) {
			options.res.send(result);
		}).fail(function(error) {
			options.res.redirect(url[0]+'/');
			bus.publish('app.error', error);
		}).done(function() {

			var duration = Date.now() - options.time;
			bus.publish('app.debug', 'Done building in ' + duration + ' ms');

		});
	}
};

PageFactory.prototype.getFramework = function() {

	var fw = {
		templates: this.templates,
		views: this.views,
		models: this.models
	};

	return fw;
};

// build function, returning a promise to the built page
PageFactory.prototype.build = function build(url, uuid, requestData) {

	var buildingPage = Q.defer();

	

	if (this.routes[url[1]]) {

		var controller = url[1];
		var action = url[2];

		var requestInstance = new this.routes[controller].instance.constructor(url, requestData, uuid);

		var output = requestInstance[action].apply(requestInstance);
		buildingPage.resolve(output);

	};

	return buildingPage.promise;

};

module.exports = PageFactory;