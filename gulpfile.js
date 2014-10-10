var gulp = require('gulp');
var less = require('gulp-less-sourcemap');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var webserver = require('gulp-webserver');

var less_path = 'www/less/**/*.less';
var less_main_path = './www/less/main.less';
var css_path = './www/css';


gulp.task('less', function () {
    gulp.src( less_main_path )
    .pipe(less({ generateSourceMap: true }))
    .pipe(minifyCss({ keepSpecialComments: 0 }))
    .pipe(gulp.dest( css_path ));
});

gulp.task('watch', ['less'], function () {
    gulp.watch(less_path, ['less']);
});

gulp.task('webserver', ['watch'], function() {
    gulp.src('www')
    .pipe(webserver({
        // host: 'localhost',
        host: '0.0.0.0',
        livereload: true,
        open: true
    }));
});

gulp.task('default', ['webserver']);