var express = require('express');
var Q = require('q');
var bus = require('./core/bus');
var hb = require('handlebars');

var PageFactory = require('./core/PageFactory'),
	fs = require('fs'),
	path = require('path'),
    app = express();

var factory = new PageFactory();


var directories = ['controllers','views','models','collections','templates'];



var WhirApp = function(options){

	this.library = {};
	directories.forEach(function(dir){
		this.library[dir] = {};
	},this)
	
};

WhirApp.prototype.getStructure = function() {
	var cwd = process.cwd() + '/app/',
		_this = this;

	directories.forEach(function(searchDirectory){

		var pathToSearch = cwd+searchDirectory
		
		if (fs.existsSync(pathToSearch)) {
			var files = fs.readdirSync(pathToSearch);

			files.forEach(function(file){
				
				var toLoad = pathToSearch+'/'+file;
				var extension = path.extname(toLoad),
					basename = path.basename(toLoad,extension);

				if (extension === '.js') {

					var loadedController = require(toLoad);

					loadedController.prototype.name = basename;
					_this.library[searchDirectory][basename] = new loadedController();

					// _this.library[searchDirectory][basename] = new (require(toLoad))();
				};

				if (extension === '.hbs') {

					var template = fs.readFileSync(toLoad,'UTF8');
					// console.log(template);

					_this.library[searchDirectory][basename] = hb.compile(template);	
				};


			},_this);

		} else {
			bus.publish('app.debug','[APP] No "'+searchDirectory+'" diectory');
		}
	},this);

	console.log(this.library)

};

WhirApp.prototype.start = function start (){
	

	this.getStructure();

	app.get('*', function(req, res, next) {
	    bus.publish('request.in', {
	        req: req,
	        res: res,
	        id: Date.now(),
	        url: req.url
	    });
	});

	app.listen(8000);
};

WhirApp.prototype.factory = factory;
WhirApp.prototype.bus = bus;

module.exports = WhirApp;


