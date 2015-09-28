// gulpfile.js

var gulp = require('gulp');
var gls = require('gulp-live-server');

gulp.task('myTask', function() {
    console.log('Running my task!');
});

gulp.task('server', function() {
    var server = gls('.');
    server.start().then(function(result) {
        console.log('Server exited with result:', result);
    });
    return gulp.watch(['index.js', 'models/*.js'], function(file) {
    	console.log(file);
        server.start.apply(server);
    });
});