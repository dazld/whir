var Backbone = require('backbone');
var bus = require('../bus');

var ServerRouter = Backbone.Router.extend({
	bus: bus,
	routes: {
		"":"index",
		"release/:id":"release",
		"release":"release"

	},
	index: function(){
		this.bus.publish('routed',{
			page: "default"
		});
	},
	release: function(id){

		id = id || false;
		
		this.bus.publish('routed',{
			id: id,
			page: "release"
		});
		
	}
});

module.exports = ServerRouter;
