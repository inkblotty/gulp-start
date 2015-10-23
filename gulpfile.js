// gulpfile

// include gulp
var gulp = require('gulp');

// include plug-ins
var autoprefix = require('gulp-autoprefixer'), // automatically adds vender prefixes
	changed = require('gulp-changed'), // checks to see what needs updating -- only the changed files
	concat = require('gulp-concat'),
	imagemin = require('gulp-imagemin'),
	jshint = require('gulp-jshint'),
	minifyCSS = require('gulp-minify-css'),
	minifyHTML = require('gulp-minify-html'),
	sass = require('gulp-sass'),
	stripDebug = require('gulp-strip-debug'), // removes console and debug statements
	uglify = require('gulp-uglify');

// JS hint task
gulp.task('jshint', function() {
	gulp.src('./src/scripts/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function() {
	var imgSrc = './src/images/**/*',
		imgDst = './build/images';

	gulp.src(imgSrc)
		.pipe(changed(imgDst))
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

// JS concat, strip debugging, and minify
gulp.task('scripts', function() {
	gulp.src(['./src/scripts/lib.js', '.src/scripts/*.js']) /* library scripts */
		.pipe(concat('script.js'))
		.pipe(stripDebug())
		.pipe(uglify())
		.pipe(gulp.dest('./build/scripts/'));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
	gulp.src(['./src/styles/*.scss'])
		.pipe(sass().on('error', sass.logError)) // double check this
		.pipe(concat('styles.css'))
		.pipe(autoprefix('last 2 versions'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./build/styles/'));
});

// default task
gulp.task('default', ['imagemin', 'htmlpage', 'scripts', 'styles'], function() {
	// watch for HTML changes
	gulp.watch('./src/*.html', function() {
		gulp.run('htmlpage');
	});

	// watch for JS changes
	gulp.watch('./src/scripts/*.js', function() {
		gulp.run('jshint', 'scripts');
	});

	// watch for CSS changes
	gulp.watch('./src/styles/*.scss', function() {
		gulp.run('styles');
	});
});