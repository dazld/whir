var express = require('express');
var Q = require('q');
var bus = require('./core/bus');
var hb = require('handlebars');

var PageFactory = require('./core/PageFactory')
    app = express();

var factory = new PageFactory();

var WhirView = require('./core/views/WhirView');
var WhirController = require('./core/controllers/WhirController');


var library = {
	views: {
		Base: WhirView
	},
	controller: {
		Base: WhirController
	}
};



var WhirApp = function(options){

	
};

WhirApp.prototype.start = function start (){
	
	bus.publish('whir.start',{
		some:'data'
	});

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
WhirApp.prototype.library = library;
WhirApp.prototype.bus = bus;

module.exports = WhirApp;


