var express = require('express');
var Q = require('q');
var bus = require('./core/bus');
var hb = require('handlebars');
var uuid = require('node-uuid').v4;


var PageFactory = require('./core/PageFactory'),
	fs = require('fs'),
	path = require('path'),
	app = express();

var factory = new PageFactory();


var directories = ['controllers', 'views', 'models', 'collections', 'templates'];



var WhirApp = function(options) {
	this.options = options;
	this.library = {};
	directories.forEach(function(dir) {
		this.library[dir] = {};
	}, this);

};

WhirApp.prototype.start = function start() {

	this.getStructure()
		.then(this.bootServer.bind(this),

	function(error) {
		console.log('[ERROR]: booting server: ', error);
	});


};


WhirApp.prototype.bootServer = function(args) {

	var defaultRoute = this.options.defaultRoute || '/base/index';

	app.use(function(req,res,next){
		req.user = uuid();
		next()
	});

	app.get('*', function(req, res, next) {

		if (req.url === '/') {
			req.url = defaultRoute;
		};

		var normalizedUrl = path.normalize(req.url);
		if (normalizedUrl !== req.url) {
			res.redirect(normalizedUrl, 301);
			next();
		} else {
			bus.publish('request.in', {
				time: Date.now(),
				uuid: uuid(),
				req: req,
				res: res,
				url: req.url
			});	
		}
		
	});

	app.listen(8000);
};

WhirApp.prototype.getStructure = function() {

	var loadingStructure = [];

	var cwd = process.cwd() + '/app/',
		_this = this;

	directories.forEach(function(searchDirectory) {

		var directoryLoading = Q.defer();

		var pathToSearch = cwd + searchDirectory

		if (fs.existsSync(pathToSearch)) {
			var files = fs.readdirSync(pathToSearch);

			files.forEach(function(file) {

				var toLoad = pathToSearch + '/' + file;
				var extension = path.extname(toLoad),
					basename = path.basename(toLoad, extension);

				if (extension === '.js') {


					
					// _this.library[searchDirectory][basename] = resource;

					var loadedResource = _this.library[searchDirectory][basename] = require(toLoad);
					loadedResource.prototype.name = basename;

					if (searchDirectory === 'controllers'){
						loadedResource.prototype.parseRoutes.apply(loadedResource.prototype);
					}

					if (searchDirectory === 'views') {
						
						bus.publish('app.views',loadedResource);
					};
					

					
				};

				if (extension === '.hbs') {

					var template = fs.readFileSync(toLoad, 'UTF8');
					// console.log(template);

					_this.library[searchDirectory][basename] = hb.compile(template);
					bus.publish('app.templates',_this.library[searchDirectory])
				};


			}, _this);

			directoryLoading.resolve('Loaded: ' + pathToSearch);

		} else {
			bus.publish('app.debug', '[APP] No "' + searchDirectory + '" directory');
			directoryLoading.resolve('not found or empty: ' + pathToSearch);
		}

		loadingStructure.push(directoryLoading.promise);

	}, this);



	return Q.allSettled(loadingStructure);

};



WhirApp.prototype.factory = factory;
WhirApp.prototype.bus = bus;

module.exports = WhirApp;