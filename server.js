var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var log = require('./libs/log')(module);
var app = express();
var config = require('./libs/config');
var SchoolsModel = require('./libs/mongoose').SchoolsModel;
var ClassroomsModel = require('./libs/mongoose').ClassroomsModel;
var LecturesModel = require('./libs/mongoose').LecturesModel;

app.use(express.static(path.join(__dirname, "build")));
app.listen(config.get('port'), function  () {
    log.info('Express server is listening on port', config.get('port'));
});

// app.use(function(req, res, next){
//     res.status(404);
//     log.debug('Not found URL: %s',req.url);
//     res.send({ error: 'Not found' });
//     return;
// });

// app.use(function(err, req, res, next){
//     res.status(err.status || 500);
//     log.error('Internal error(%d): %s',res.statusCode,err.message);
//     res.send({ error: err.message });
//     return;
// });

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post('/lectures', function(req, res) {
    
    console.log(req.body);

    LecturesModel.find({classroom: req.body.classroom}, function (err, schools) {
    res.json(schools);
    });
    
});

app.post('/lectures', function(req, res) {
    res.send('This is not implemented now');
});

app.get('/lectures/:id', function(req, res) {
    res.send('This is not implemented now');
});

app.put('/lectures/:id', function (req, res){
    res.send('This is not implemented now');    
});

app.delete('/lectures/:id', function (req, res){
    res.send('This is not implemented now');
});