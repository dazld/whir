var _ = require('underscore');
var bus = require('../bus');
var rewire = require('rewire');



var Modulecache = function(){
	this.cache = {};
};

Modulecache.prototype.get = function(id, module) {
	if (true) {};
};

Modulecache.prototype.set = function(module){

	var modResolved = require.resolve(module);
	var toCache = require(modResolved);

	

	var deps = _.reduce(require.cache[modResolved].children,function(memo, item){
		memo.push(item.id);
		return memo;
	},[]);
	
	this.cache[modResolved] = {
		exports: toCache,
		deps: deps
	};

};

Modulecache.prototype.clear = function(id, module) {
	if (id && !module) {
		this.cache[id] = null;
		delete this.cache[id];
	} else if (id && module){
		this.cache[id][module] = null;
		delete this.cache[id][module];
	} else {
		this.cache = null;
		this.cache = {};
	}
};

var Sandboxer = function(){
	var _this = this;
	this.cache = new Modulecache();
	this.definitionCache = new Modulecache();
	this.bus = bus;
	this.bus.subscribe('module.dependencies',function(data,topic){
		console.log(data.name);

		process.nextTick(function(){
			_this.definitionCache.set(data.name);
		});

		
	});
};

Sandboxer.prototype.create = function(locals){

	var cache = this.cache;

	for(var local in locals){
		console.log(local, locals[local]);
	}

	return function(moduleId){
		
		var resolvedId = require.resolve(moduleId);

		var rewiredModule = rewire(resolvedId);
		for(var local in locals){
			rewiredModule.__set__(local,locals[local]);
		}

		return rewiredModule;
	}
};

module.exports = new Sandboxer();
