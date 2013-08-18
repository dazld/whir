var Backbone = require('backbone');
var _ = require('underscore');
var bus = require('../bus');
var $ = require('cheerio');
var isServer = require('../lib/is-server');
var getTemplate = require('../lib/templates').get;



var WhirView = Backbone.View.extend({
	bus: bus,
	isServer: isServer,
	_getTemplate: getTemplate
});

if (isServer) {

	bus.publish('app.debug','replacing Backbone\'s jqueryified element with cheerio');

	var cheerio = require('cheerio');

	WhirView.prototype._ensureElement = function() {
		if (!this.el) {
			var attrs = _.extend({}, _.result(this, 'attributes'));
			if (this.id) attrs.id = _.result(this, 'id');
			if (this.className) attrs['class'] = _.result(this, 'className');
			var $el = cheerio('<' + _.result(this, 'tagName') + '>');

			$el.attr(attrs);
			this.setElement($el, false);
		} else {
			this.setElement(_.result(this, 'el'), false);
		}
	};

	WhirView.prototype.setElement = function(element, delegate) {
		if (this.$el) this.undelegateEvents();
		this.$el = element; //instanceof cheerio ? element : cheerio(element);
		this.el = this.$el[0];
		if (delegate !== false) this.delegateEvents();
		return this;
	};
};

module.exports = WhirView;