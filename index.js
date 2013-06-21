var express = require('express');
var Q = require('q');
var Postal = require('postal');
var hb = require('handlebars');

var postal = Postal();
var channel = postal.channel();

var nastyGlobal = false;

hb.registerHelper('dostuff',function(){
	return nastyGlobal;
});

channel.subscribe('request.in',function(data){
	
	var lh = hb.create();

	lh.registerHelper('dostuff',function(){
		return data.id;
	});

	setTimeout(function(){
		console.log(' - inside request event -',data.id,lh.helpers['dostuff']());
	},data.timer);
	console.log(data.id);
	
	data.res.send('hi')
});

var app = express();

app.get('/',function(req,res,next){

	var timer = Math.random()*5000;
	nastyGlobal = Date.now();
	
	setTimeout(function(){
		console.log('global: ',hb.helpers['dostuff']());
	},timer);
	

	channel.publish('request.in',{
		req: req,
		res: res,
		id: nastyGlobal,
		timer: timer
	});
});

app.listen(8000);