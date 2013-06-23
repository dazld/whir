var Postal = require('postal');
var postal = Postal();


var channel = postal.channel();

channel.subscribe('*.*',function(data,topic){
    console.log(Date.now(), topic.topic)
});

module.exports = channel;
