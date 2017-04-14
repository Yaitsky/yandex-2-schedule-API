var mongoose = require('mongoose');
var log = require('./log')(module);
var config = require('./config');

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function (error) {
    log.error('connection error:', error.message);
});

db.once('open', function callback () {
    log.info('connected to DB');
});

var Schema = mongoose.Schema;

var Schools = new Schema({
    title: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    }
});

var Classrooms = new Schema({
    title: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

var Lectures = new Schema({
    school: {
        type: Array,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    teacher: {
        type: Array,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    classroom: {
        type: String,
        required: true
    }
});

var SchoolsModel = mongoose.model('Schools', Schools);
var ClassroomsModel = mongoose.model('Classrooms', Classrooms);
var LecturesModel = mongoose.model('Lectures', Lectures);

module.exports.SchoolsModel = SchoolsModel;
module.exports.ClassroomsModel = ClassroomsModel;
module.exports.LecturesModel = LecturesModel;


