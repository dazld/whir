var Backbone = require('backbone'),
    bus = require('../bus'),
    annotate = require('../helpers/annotate'),
    _ = require('underscore');


// if we have this function signature, then let's assume its a route
var expectedRouteSignature = ['req', 'res'];


var WhirController = function WhirController () {
    if (!_.isString(this.name)) {
        throw 'controllers require a name property to setup routes';
    };
    this.routes = this.routes && _.isArray(this.routes) ? this.routes : [];

    for (var prop in this) {

        if (_.isFunction(this[prop])) {
            if (_.isEqual(this.getSignature(this[prop]), expectedRouteSignature)) {
                this.routes.push(prop);
            }
        }
    }



    this.initialize.apply(this, null);
};

WhirController.prototype.getSignature = function(object) {
    return annotate(object);
};

WhirController.extend = Backbone.View.extend;



module.exports = WhirController;