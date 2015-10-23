// gulpfile

// include gulp
var gulp = require('gulp');

// include plug-ins
var changed = require('gulp-changed'),
	imagemin = require('gulp-imagemin'),
	jshint = require('gulp-jshint'),
	minifyHTML = require('gulp-minify-html');

// JS hint task
gulp.task('jshint', function() {
	gulp.src('./src/scripts/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function() {
	var imgSrc = './src/images/**/*',
		imgDist = './build/images';

	gulp.src(imgSrc)
		.pipe(changed(imgDist))
		.pipe(imagemin())
		.pipe(gulp.dest(imgDst));
});

// minify html
gulp.task('htmlpage', function() {
	var htmlSrc = './src/*.html',
		htmlDst = './build';

	gulp.src(htmlSrc)
		.pipe(changed(htmlDst))
		.pipe(minifyHTML())
		.pipe(gulp.dest(htmlDst));
});

