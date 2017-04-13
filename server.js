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

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//GET показать все лекции/школы/аудитории
function getLists (req, res, name) {
    var itemModel;
    if (name == "lectures") {
        itemModel = LecturesModel;
    } else if (name == "schools") {
        itemModel = SchoolsModel;
    } else {
        itemModel = ClassroomsModel;
    }

    return itemModel.find(function (err, list) {
    if (!err) {
        res.send(list);
    } else {
        res.statusCode = 500;
        log.error('Internal error', res.statusCode,err.message);
        return res.send({error: 'Server error'});
    }   
    });
}

app.get('/lectures', function (req, res) {
    return getLists(req, res, "lectures");
});

app.get('/schools', function (req, res) {
    return getLists(req, res, "schools");
});

app.get('/classrooms', function (req, res) {
    return getLists(req, res, "classrooms");
});

//POST показать список лекций заданной школы или в заданной аудитории в заданной период
function getLecturesByFilter (req, res) {
    if (req.body.school) {
        return LecturesModel.find({school: req.body.school}, function (err, list) {
        if (!err) {
            var startDate = new Date(req.body.start).getTime();
            var endDate = new Date(req.body.end).getTime();
            var resultList = [];

            for (var i = 0; i < list.length; i++) {
                var itemDate = new Date(list[i].date).getTime();

                if ((itemDate >= startDate) && (itemDate < endDate)) {
                    resultList.push(list[i]);
                }
            }

            res.send(resultList);
        } else {
            res.statusCode = 500;
            log.error('Internal error', res.statusCode,err.message);
            return res.send({error: 'Server error'});
            }
        }); 
    } else {
        return LecturesModel.find({classroom: req.body.classroom}, function (err, list) {
        if (!err) {
            var startDate = new Date(req.body.start).getTime();
            var endDate = new Date(req.body.end).getTime();
            var resultList = [];

            for (var i = 0; i < list.length; i++) {
                var itemDate = new Date(list[i].date).getTime();

                if ((itemDate >= startDate) && (itemDate < endDate)) {
                    resultList.push(list[i]);
                }
            }

            res.send(resultList);
        } else {
            res.statusCode = 500;
            log.error('Internal error', res.statusCode,err.message);
            return res.send({error: 'Server error'});
            }
        }); 
    } 
};
app.post('/lectures:filter', function (req, res) {
    return getLecturesByFilter(req, res);
});

//POST добавить лекцию/школу/аудиторию
function postNewItem (req, res, name) {
    var itemModel;
    var item;
    if (name == "lectures") {
        itemModel = LecturesModel;
        item = new itemModel({
            school: req.body.school,
            number: req.body.number,
            title: req.body.title,
            teacher: req.body.teacher,
            date: req.body.date,
            video: req.body.video,
            classroom: req.body.classroom
        });
    } else if (name == "schools") {
        itemModel = SchoolsModel;
        item = new itemModel({
            title: req.body.title,
            count: req.body.count
        });
    } else {
        itemModel = ClassroomsModel;
        item = new itemModel({
            title: req.body.title,
            count: req.body.count,
            location: req.body.location
        });
    }

    item.save(function (err) {
        if (!err) {
            log.info('item created');
            return res.send({status: 'OK', item: item});
        } else {
            log.error(err);
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
}

app.post('/lectures', function (req, res) {
    return postNewItem(req, res, "lectures");
});

app.post('/schools', function (req, res) {
    return postNewItem(req, res, "schools");
});

app.post('/classrooms', function (req, res) {
    return postNewItem(req, res, "classrooms");
});

//PUT изменить лекцию/школу/аудиторию
function updateItem (req, res, name) {
    var itemModel;
    if (name == "lectures") {
        itemModel = LecturesModel;
    } else if (name == "schools") {
        itemModel = SchoolsModel;
    } else {
        itemModel = ClassroomsModel;
    }

    return itemModel.findOne({title: req.body.title}, function (err, item) {
        if (!item) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        if (name == "lectures") {
            item.school = req.body.school;
            item.number = req.body.number;
            item.teacher = req.body.teacher;
            item.date = req.body.date;
            item.video = req.body.video;
            item.classroom = req.body.classroom;
        } else if (name == "schools") {
            item.count = req.body.count;
        } else {
            item.count = req.body.count;
            item.location = req.body.location;
        }
        
        return item.save(function (err) {
            if (!err) {
                log.info('item updated');
                return res.send({status: 'OK', item: item});
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
}

app.put('/lectures:title', function (req, res) {
    return updateItem(req, res, "lectures");
});

app.put('/schools:title', function (req, res) {
    return updateItem(req, res, "schools");
});

app.put('/classrooms:title', function (req, res) {
    return updateItem(req, res, "classrooms");
});

//DELETE удалить лекцию/школу/аудиторию
function deleteItem (req, res, name) {
    var itemModel;
    if (name == "lectures") {
        itemModel = LecturesModel;
    } else if (name == "schools") {
        itemModel = SchoolsModel;
    } else {
        itemModel = ClassroomsModel;
    }

    return itemModel.findOne({title: req.body.title}, function (err, item) {
        if (!item) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return item.remove(function (err) {
            if (!err) {
                log.info('item deleted');
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
}

app.delete('/lectures:title', function (req, res) {
    return deleteItem(req, res, "lectures");
});

app.delete('/schools:title', function (req, res) {
    return deleteItem(req, res, "schools");
});

app.delete('/classrooms:title', function (req, res) {
    return deleteItem(req, res, "classrooms");
});