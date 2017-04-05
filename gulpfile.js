'use strict';

global.$ = {
    package: require('./package.json'),
    config: require('./gulp/config'),
    path: {
        task: require('./gulp/paths/tasks.js'),
        jsFoundation: require('./gulp/paths/js.foundation.js'),
        cssFoundation: require('./gulp/paths/css.foundation.js'),
        app: require('./gulp/paths/app.js')
      },
    gulp: require('gulp'),
    rimraf: require('del'),
    merge: require('merge-stream'),
    browserify : require('browserify'),
    source : require('vinyl-source-stream'),
    buffer : require('vinyl-buffer'),
    babel : require('babelify'),
    browserSync: require('browser-sync').create(),
    gp: require('gulp-load-plugins')(),
    sassGlob: require('gulp-sass-glob'),
    cssunit: require('gulp-css-unit'),
    handlebars: require('gulp-handlebars'),
    wrap: require('gulp-wrap'),
    declare: require('gulp-declare'),
    concat: require('gulp-concat'),
    defineModule: require('gulp-define-module')
};

$.path.task.forEach(function(taskPath) {
    require(taskPath)();
});

$.gulp.task('default', $.gulp.series(
    'clean',
    'templates',
    $.gulp.parallel(
        'sass',
        'pug',
        'js:foundation',
        'js:process',
        'copy:image',
        'copy:font',
        'css:foundation'
    ),
    $.gulp.parallel(
        'watch',
        'serve'
    )
));
