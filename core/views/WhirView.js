var Backbone = require('backbone');
var _ = require('underscore');
var bus = require('../bus');
var $ = require('cheerio');
var isServer = ('../lib/is-server');



var WhirView = Backbone.View.extend({
	bus: bus
});

if (isServer) {

	bus.publish('app.debug','replacing Backbone\'s jqueryified element with cheerio');

	var cheerio = require('cheerio');

	WhirView.prototype._ensureElement = function() {
		if (!this.el) {
			var attrs = _.extend({}, _.result(this, 'attributes'));
			if (this.id) attrs.id = _.result(this, 'id');
			if (this.className) attrs['class'] = _.result(this, 'className');
			var DOM = cheerio.load('<' + _.result(this, 'tagName') + '>', {
				ignoreWhitespace: true // should probably bet set false for dev, but true for live stuff
			});
			var $el = DOM.root();
			$el.attr(attrs);
			this.setElement($el, false);
		} else {
			this.setElement(_.result(this, 'el'), false);
		}
	};

	WhirView.prototype.setElement = function(element, delegate) {
		if (this.$el) this.undelegateEvents();
		this.$el = element instanceof cheerio ? element : cheerio(element);
		this.el = this.$el[0];
		if (delegate !== false) this.delegateEvents();
		return this;
	};
};

module.exports = WhirView;