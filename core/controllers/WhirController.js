var Backbone = require('backbone'),
    bus = require('../bus'),
    annotate = require('../helpers/annotate'),
    _ = require('underscore');


// if we have this function signature, then let's assume its a route
var expectedRouteSignature = ['req', 'res', 'params'];


var WhirController = function WhirController () {

    if (!_.isString(this.name)) {
        // throw 'controllers require a name property to setup routes';
    };

    this.bus.publish('app.controller',{
        name: this.name
    });

    this.routes = this.routes && _.isObject(this.routes) ? this.routes : {};
    this.parseRoutes();
    this.initialize.apply(this, arguments);
};

WhirController.prototype.initialize = function() {
    console.log(arguments);
};

WhirController.prototype.parseRoutes = function() {
    
    var parsedRoutes = [];

    for (var prop in this) {
        // console.log(this.hasOwnProperty(prop))
        if (_.isFunction(this[prop]) && _.isEqual(this.getSignature(this[prop]), expectedRouteSignature)) {

            var toPush = {};


            if (prop === 'index') {
                toPush[''+this.name] = prop;
            } else {
                toPush[this.name+'/'+prop] = prop;
                // parsedRoutes.push(this.name+'/'+prop);
            }

            parsedRoutes.push(toPush);
            
        }
    }

    _.each(this.routes,function(value, key, list){
        var toPush = {};
        toPush[key] = value;
        parsedRoutes.push(toPush);
    },this);

    // console.log('[debug]: ',this.routes);

    this.bus.publish('app.routes',{
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


