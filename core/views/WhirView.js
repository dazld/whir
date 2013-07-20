var Backbone = require('backbone');
var bus = require('../bus');
var $ = require('cheerio');

Backbone.$ = $;

var WhirView = Backbone.View.extend({
	bus: bus
});

module.exports = WhirView;

