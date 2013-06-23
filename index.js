var express = require('express');
var Q = require('q');
var bus = require('./core/bus');
var hb = require('handlebars');

// var postal = Postal();
var PageFactory = require('./core/PageFactory')
    app = express();

var factory = new PageFactory();



bus.subscribe('request.in', function(data) {
    data.res.send();
});

app.get('/', function(req, res, next) {
    bus.publish('request.in', {
        req: req,
        res: res,
        id: Date.now(),
        url: req.url
    });
});

app.listen(8000);

module.exports = {
    app:app
};