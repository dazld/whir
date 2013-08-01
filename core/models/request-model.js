var Backbone = require('backbone');

var RequestModel = Backbone.Model.extend({
	initialize: function(){},
	defaults: {
		url: '/',
		headers: [],
		cookies: []
	}
});

module.exports = RequestModel;

