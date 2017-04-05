'use strict';

module.exports = function () {
    $.gulp.task('templates', function(){
        return $.gulp.src(['./source/hbs-templates/*.hbs'])
            .pipe($.handlebars())
            .pipe($.defineModule('node'))
            .pipe($.gulp.dest('./source/js/templates/'));
    });
}


// module.exports = function () {
//     $.gulp.task('templates', function(){
//         return $.gulp.src('source/hbs-templates/*.hbs')
//             .pipe($.handlebars())
//             .pipe($.wrap('Handlebars.template(<%= contents %>)'))
//             .pipe($.declare({
//                 namespace: 'MyApp.templates',
//                 noRedeclare: true, // Avoid duplicate declarations
//             }))
//             .pipe($.concat('templates.js'))
//             .pipe($.gulp.dest('source/js/templates'));
//     });
// }