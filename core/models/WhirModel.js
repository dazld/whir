var Backbone = require('backbone'),
	bus = require('../bus');


var WhirModel = Backbone.Model.extend({
	bus: bus
});

module.exports = WhirModel;