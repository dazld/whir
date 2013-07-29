var _ = require('underscore');
var bus = require('../bus');
var rewire = require('rewire');



var Modulecache = function(){
	this.cache = {};
};

Modulecache.prototype.get = function(moduleId) {
	if (this.cache[moduleId]) {
		return this.cache[moduleId];
	} else {
		// throw 'Module not found';
		return false;
	}
};

Modulecache.prototype.set = function(moduleId, module){

	this.cache[moduleId] = module;

};

Modulecache.prototype.clear = function(moduleId) {
	if (this.cache[moduleId]) {
		this.cache[moduleId] = null;
		delete this.cache[moduleId];
		return true;
	} else {
		return false;
	}

};

var Sandboxer = function(){
	var _this = this;
	this.bus = bus;
};

Sandboxer.prototype.create = function(locals){

	var cache = new Modulecache();


	return function(moduleId){
		
		var resolvedId = require.resolve(moduleId);


		var deps = _.map(require.cache[resolvedId].children,function(dep){
			return dep.id ? dep.id : false;
		});
		


		if (cache[moduleId]) {
			return cache[moduleId];
		};

		var rewiredModule = rewire(resolvedId);
		
		for(var local in locals){
			rewiredModule.__set__(local,locals[local]);
		}

		cache.set(resolvedId, rewiredModule);

		return rewiredModule;
	}
};

module.exports = new Sandboxer();
