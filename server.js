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

//GET показать все лекции
app.get('/lectures', function(req, res) {
    return LecturesModel.find(function (err, lectures) {
    if (!err) {
        res.send(lectures);
    } else {
        res.statusCode = 500;
        log.error('Internal error', res.statusCode,err.message);
        return res.send({error: 'Server error'});
    }   
    });
});

//POST добавить одну лекцию
app.post('/lectures', function(req, res) {
    var lecture = new LecturesModel({
        school: req.body.school,
        number: req.body.number,
        title: req.body.title,
        teacher: req.body.teacher,
        date: req.body.date,
        video: req.body.video,
        classroom: req.body.classroom
    });
    
    lecture.save(function (err) {
        if (!err) {
            log.info('lecture created');
            return res.send({status: 'OK', lecture: lecture});
        } else {
            if (err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({error: 'Validation error'});
            } else {
                res.statusCode = 500;
                res.send({error: 'Server error'});
            }
            log.error('Internal error', res.statusCode, err.message);
        }
    });
});

//PUT изменить лекцию
app.put('/lectures:title', function (req, res){
    return LecturesModel.findOne({title: req.body.title}, function (err, lecture) {
        if (!lecture) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        lecture.date = req.body.date;
        lecture.classroom = req.body.classroom;
        
        return lecture.save(function (err) {
            if (!err) {
                log.info('lecture updated');
                return res.send({status: 'OK', lecture: lecture});
            } else {
                if (err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({error: 'Validation error'});
                } else {
                    res.statusCode = 500;
                    res.send({error: 'Server error'});
                }
                log.error('Internal error', res.statusCode, err.message);
            }
        })
    }) 
});

//DELETE удалить лекцию по названию
app.delete('/lectures:title', function (req, res){
    return LecturesModel.findOne({title: req.body.title}, function (err, lecture) {
        if (!lecture) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return lecture.remove(function (err) {
            if (!err) {
                log.info('lecture deleted');
                return res.send({status: 'OK'});
            } else {
                if (err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({error: 'Validation error'});
                } else {
                    res.statusCode = 500;
                    res.send({error: 'Server error'});
                }
                log.error('Internal error', res.statusCode, err.message);
            }
        })
    })
});