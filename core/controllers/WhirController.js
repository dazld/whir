var Backbone = require('backbone'),
    bus = require('../bus'),
    sandboxer = require('../helpers/sandboxer'),
    annotate = require('../helpers/annotate'),
    handlebars = require('handlebars'),
    templates = require('../lib/templates'),
    _ = require('underscore');


// if we have this function signature, then let's assume it is a route
// @todo think about what sig to have here (this one is dumb)
var expectedRouteSignature = ['req', 'res', 'params'];


var WhirController = function WhirController(url, requestData, uuid) {

    this.url = url;
    this.templates = templates;
    this.sandboxedModuleFactory = false; // should be instanced by init method
    this.requestData = requestData; // BB model with headers, cookies, url

    this.uuid = uuid;
    this.hb = handlebars.create();

    this.routes = this.routes && _.isObject(this.routes) ? this.routes : {};

    this.initialize.apply(this, arguments);

};

WhirController.prototype._createSandbox = function(locals) {
    this.sandboxedModuleFactory = sandboxer.create(locals);
};

WhirController.prototype.getSandboxedModule = function(module){
    var resolvedName = require.resolve(module);

    console.log('trying to load ', resolvedName);

    return this.sandboxedModuleFactory(resolvedName);
}

WhirController.prototype.initialize = function() {
    // console.log('CONTROLLER INIT',arguments);
};

WhirController.prototype.parseRoutes = function() {

    var parsedRoutes = [];

    for (var prop in this) {
        // console.log(this.hasOwnProperty(prop))
        if (_.isFunction(this[prop]) && _.isEqual(this.getSignature(this[prop]), expectedRouteSignature)) {

            var toPush = {};


            if (prop === 'index') {
                toPush['' + this.name] = prop;
            } else {
                toPush[this.name + '/' + prop] = prop;
                // parsedRoutes.push(this.name+'/'+prop);
            }

            parsedRoutes.push(toPush);

        }
    }

    _.each(this.routes, function(value, key, list) {
        var toPush = {};
        toPush[key] = value;
        parsedRoutes.push(toPush);
    }, this);

    // console.log('[debug]: ',this.routes);

    this.bus.publish('app.routes', {
        name: this.name,
        routes: parsedRoutes,
        instance: this
    });

};

WhirController.prototype.getSignature = function(object) {
    return annotate(object);
};

WhirController.prototype.bus = bus;

WhirController.extend = Backbone.Model.extend; // use backbone's extend, giving access to __super__



module.exports = WhirController;