var Handlebars = require('handlebars'),
	bus = require('../bus');

var templateStore = {};

var Templates = function(){
	this.bus = bus;
	this.bus.subscribe('app.templates',this.addTemplate.bind(this));

};

Templates.prototype.addTemplate = function(template){
	templateStore[template.name] = template.tpl;
}

Templates.prototype.get = function(name){
	if (templateStore[name]) {
		return function(context){
			return templateStore[name](context);	
		}
		
	} else {
		throw 'Template '+template+' not found';
	}
}





module.exports = new Templates();