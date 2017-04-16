var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var log = require('./libs/log')(module);
var app = express();
var config = require('./libs/config');
var SchoolsModel = require('./libs/mongoose').SchoolsModel;
var ClassroomsModel = require('./libs/mongoose').ClassroomsModel;
var LecturesModel = require('./libs/mongoose').LecturesModel;

app.use(express.static(path.join(__dirname, 'build')));
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
    if (name == 'lectures') {
        itemModel = LecturesModel;
    } else if (name == 'schools') {
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
    return getLists(req, res, 'lectures');
});

app.get('/schools', function (req, res) {
    return getLists(req, res, 'schools');
});

app.get('/classrooms', function (req, res) {
    return getLists(req, res, 'classrooms');
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
}
app.post('/lectures:filter', function (req, res) {
    return getLecturesByFilter(req, res);
});

//POST добавить лекцию/школу/аудиторию
function validateSchoolAndDate (school, date) {
    var promise = LecturesModel.find({school: school, date: date}).exec();

    return promise;
}

function validateClassroomAndDate (classroom, date) {
    var promise = LecturesModel.find({classroom: classroom, date: date}).exec();

    return promise;
}

function getSchoolCount (school) {
    var promise = SchoolsModel.findOne({title: school}).exec();

    return promise;
}

function validateStudentsCount (classroom) {
    var promise = ClassroomsModel.findOne({title: classroom}).exec();

    return promise;
}

function postNewLecture (req, res) {
    var lecture = new LecturesModel({
        school: req.body.school,
        title: req.body.title,
        teacher: req.body.teacher,
        date: req.body.date,
        video: req.body.video,
        classroom: req.body.classroom
    });
    
    // проверки по школе и дате, по аудитории и дате, вместимости аудитории и количеству студентов
    var errors = [];
    var schoolCount;
    var classroomCount;

    validateSchoolAndDate(req.body.school, req.body.date)
    .then(function (list) {
        if (list.length != 0) {
            errors.push('Для данной школы уже намечена лекция в указанную дату');
        }

        return validateClassroomAndDate(req.body.classroom, req.body.date);
    })
    .then(function (list) {
        if (list.length != 0) {
            errors.push('В данной аудитории уже намечена лекция в указанную дату');
        }

        return getSchoolCount(req.body.school);
    })
    .then(function (item) {
        if (item) {
            schoolCount = item.count;
        } else {
            errors.push('Такой школы не существует или она не добавлена в базу данных'); 
        }

        return validateStudentsCount(req.body.classroom);
    })
    .then(function (item) {
        if (item) {
            classroomCount = item.count;
            if (schoolCount && classroomCount < schoolCount) {
                errors.push('Вместимость аудитории меньше, чем количество студентов указанной школы');
            }
        } else {
            errors.push('Такой аудитории не существует или она не добавлена в базу данных');
        }

        if (errors.length == 0) {
            lecture.save(function (err) {
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
        } else {
            res.statusCode = 400;
            res.send({error: errors});
            log.error('Ошибки валидации: ' + errors.toString());
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

function postNewItem (req, res, name) {
    var itemModel;
    var item;
    
    if (name == 'schools') {
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
    return postNewLecture(req, res);
});

app.post('/schools', function (req, res) {
    return postNewItem(req, res, 'schools');
});

app.post('/classrooms', function (req, res) {
    return postNewItem(req, res, 'classrooms');
});

//PUT изменить лекцию/школу/аудиторию
function updateLecture (req, res) {
    var errors = [];
    var schoolCount;
    var classroomCount;

    validateSchoolAndDate(req.body.school, req.body.date)
    .then(function (list) {
        if (list.length > 1) {
            errors.push('Для данной школы уже намечена лекция в указанную дату');
        }

        return validateClassroomAndDate(req.body.classroom, req.body.date);
    })
    .then(function (list) {
        if (list.length > 1) {
            errors.push('В данной аудитории уже намечена лекция в указанную дату');
        }

        return getSchoolCount(req.body.school);
    })
    .then(function (item) {
        if (item) {
            schoolCount = item.count;
        } else {
            errors.push('Такой школы не существует или она не добавлена в базу данных'); 
        }

        return validateStudentsCount(req.body.classroom);
    })
    .then(function (item) {
        if (item) {
            classroomCount = item.count;
            if (schoolCount && classroomCount < schoolCount) {
                errors.push('Вместимость аудитории меньше, чем количество студентов указанной школы');
            }
        } else {
            errors.push('Такой аудитории не существует или она не добавлена в базу данных');
        }

        if (errors.length == 0) {
            return LecturesModel.findOne({title: req.body.title}, function (err, lecture) {
                if (!lecture) {
                    res.statusCode = 404;
                    return res.send({error: 'Not found'});
                }

                lecture.school = req.body.school;
                lecture.teacher = req.body.teacher;
                lecture.date = req.body.date;
                lecture.video = req.body.video;
                lecture.classroom = req.body.classroom;

                return lecture.save(function (err) {
                    if (!err) {
                        log.info('lecture updated');
                        return res.send({status: 'OK', item: lecture});
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
        } else {
            res.statusCode = 400;
            res.send({error: errors});
            log.error('Ошибки валидации: ' + errors.toString());
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

function updateItem (req, res, name) {
    var itemModel;
    if (name == 'schools') {
        itemModel = SchoolsModel;
    } else {
        itemModel = ClassroomsModel;
    }

    return itemModel.findOne({title: req.body.title}, function (err, item) {
        if (!item) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        if (name == 'schools') {
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
        });
    }); 
}

app.put('/lectures:title', function (req, res) {
    return updateLecture(req, res);
});

app.put('/schools:title', function (req, res) {
    return updateItem(req, res, 'schools');
});

app.put('/classrooms:title', function (req, res) {
    return updateItem(req, res, 'classrooms');
});

//DELETE удалить лекцию/школу/аудиторию
function deleteItem (req, res, name) {
    var itemModel;
    if (name == 'lectures') {
        itemModel = LecturesModel;
    } else if (name == 'schools') {
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
        });
    });
}

app.delete('/lectures:title', function (req, res) {
    return deleteItem(req, res, 'lectures');
});

app.delete('/schools:title', function (req, res) {
    return deleteItem(req, res, 'schools');
});

app.delete('/classrooms:title', function (req, res) {
    return deleteItem(req, res, 'classrooms');
});