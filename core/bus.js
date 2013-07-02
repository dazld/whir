var Postal = require('postal');
var postal = Postal();
var _ = require('underscore')._;
var startTime = Date.now();
var channel = postal.channel();

channel.subscribe('*.*',function(data,topic){
	if (data && (data.req)) {
		data = _.clone(data);
		data.req = 'express.req';
		data.res = 'express.res';
	};

    console.log('\x1b[32m',(Date.now()-startTime)/1000+"s\x1b[0m", topic.topic, data);
});

channel.publish('core.module', {
	module: "Postal/Bus"
});

module.exports = channel;
