var gulp = require('gulp');
var gulpNgConfig = require('gulp-ng-config');

gulp.task('test', function() {
	gulp.src('./config/gulpconfig.json')
	.pipe(gulpNgConfig('indexApp.config'))
	.pipe(gulp.dest('.'))
});