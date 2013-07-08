var Backbone = require('backbone'),
    bus = require('../bus'),
    annotate = require('../helpers/annotate'),
    _ = require('underscore');


// if we have this function signature, then let's assume its a route
var expectedRouteSignature = ['req', 'res', 'params'];


var WhirController = function WhirController () {

    if (!_.isString(this.name)) {
        throw 'controllers require a name property to setup routes';
    };
    
    this.routes = this.routes && _.isArray(this.routes) ? this.routes : [];
    this.parseRoutes();
    this.initialize.apply(this, arguments);
};

WhirController.prototype.initialize = function() {
    console.log(arguments);
};

WhirController.prototype.parseRoutes = function() {
    for (var prop in this) {
        // console.log(this.hasOwnProperty(prop))
        if (_.isFunction(this[prop]) && _.isEqual(this.getSignature(this[prop]), expectedRouteSignature)) {
            this.routes.push(prop);
        }
    }
};

WhirController.prototype.getSignature = function(object) {
    return annotate(object);
};

WhirController.prototype.bus = bus;

WhirController.extend = Backbone.View.extend;



module.exports = WhirController;


