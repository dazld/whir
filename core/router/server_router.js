var Backbone = require('backbone');
var bus = require('../bus');

var ServerRouter = Backbone.Router.extend({
	bus: bus,
	routes: {
		"":"index"
		
	},
	index: function(){
		this.bus.publish('routed',{
			page: "default"
		});

		this.bus.subscribe('app.routes',this.addRoutes.bind(this));
	},
	addRoutes: function(routes){
		console.log(routes);
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
