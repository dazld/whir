var Backbone = require('backbone');
var bus = require('../bus');


var WhirView = Backbone.View.extend({
	bus: bus
});

module.exports = WhirView;

