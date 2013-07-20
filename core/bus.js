var Postal = require('postal');
var postal = Postal();
var _ = require('underscore')._;
var startTime = Date.now();
var channel = postal.channel();

function formatMB(num){
	return (num/1024/1024).toFixed(2)+"MB";
}

channel.subscribe('*.*',function(data,topic){

	var memoryStats = process.memoryUsage();



	var formattedStats = {
		rss: formatMB(memoryStats.rss),
		heapTotal: formatMB(memoryStats.heapTotal),
		headUsed: formatMB(memoryStats.heapUsed)
	};

	var memStatString = formattedStats.rss+"/"+formattedStats.heapTotal+"/"+formattedStats.headUsed;


	if (data && (data.req)) {
		data = _.clone(data);
		data.req = 'express.req';
		data.res = 'express.res';
	};

    console.log('\x1b[32m',((Date.now()-startTime)/1000).toFixed(2)+"s "+memStatString+"\x1b[0m");
    console.log('  -> [%s]:', topic.topic, data);
});

channel.publish('core.module', {
	module: "Postal/Bus"
});

module.exports = channel;
