var ENV = process.env.APP_ENV || 'production';

if (ENV === 'production') {
	require('dotenv').load();
}

var gulp = require('gulp');
var gulpNgConfig = require('gulp-ng-config');
var config = require('./config.js');
var fs = require('fs');

//We use this to create the json config file required by gulp-ng-config
makeJson = function(env, filePath) {
	fs.writeFileSync(filePath,
    JSON.stringify(env));
};

gulp.task('ng-config', function() {
	makeJson(config[ENV], './config.json');
	gulp.src('./config.json')
		.pipe(
			gulpNgConfig('indexApp.config', {
				constants: config[ENV],
		        createModule: false
			})
		)
		.pipe(gulp.dest('./public/controllers/'));
});