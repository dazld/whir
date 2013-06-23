var Postal = require('postal');
var postal = Postal();
var _ = require('underscore')._;
var startTime = Date.now();
var channel = postal.channel();

channel.subscribe('*.*',function(data,topic){
	if (data && (data.req)) {
		data = _.clone(data);
		data.req = null;
		data.res = null;
	};
    console.log((Date.now()-startTime)/1000+"s", topic.topic, data)
});

channel.publish('core.module', {
	module: "Postal/Bus"
});

module.exports = channel;
