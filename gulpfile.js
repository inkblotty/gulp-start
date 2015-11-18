// gulpfile

// include gulp
var gulp = require('gulp');

// include plug-ins
var autoprefix = require('gulp-autoprefixer'), // automatically adds vender prefixes
  browserSync = require('browser-sync'),
	changed = require('gulp-changed'), // checks to see what needs updating -- only the changed files
	concat = require('gulp-concat'),
	imagemin = require('gulp-imagemin'),
	jshint = require('gulp-jshint'),
	minifyCSS = require('gulp-minify-css'),
	minifyHTML = require('gulp-minify-html'),
	reload = browserSync.reload;
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

// JS concat -- just for debugging
gulp.task('scripts', function() {
	gulp.src(['./src/scripts/lib.js', './src/scripts/*.js'])
		.pipe(concat('script.js'))
		.pipe(gulp.dest('./build/scripts/'));
});

// JS concat, strip debugging, and uglify -- for final build
gulp.task('finalScripts', function(){
	gulp.src(['./src/scripts/lib.js', './src/scripts/*.js'])
	  .pipe(concat('script.js'))
	  .pipe(strigDebug())
	  .pipe(uglify())
	  .pipe(gulp.dest('./build/scripts/'));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
	gulp.src(['./src/styles/*.scss'])
		.pipe(sass().on('error', sass.logError))
		.pipe(changed('./src/styles/*.scss'))
		.pipe(concat('styles.css'))
		.pipe(autoprefix('last 2 versions'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./build/styles/'));
});

// browsersync
gulp.task('browser-sync', function(){
  browserSync.init({
  server: {
            baseDir: "./build/"
        },
  notify: false
  });
  gulp.watch('./src/*.html', ['htmlpage']).on('change', browserSync.reload);
  gulp.watch('./src/styles/*.scss', ['styles']).on('change', browserSync.reload);
  gulp.watch('./src/scripts/*.js', ['jshint', 'scripts']).on('change', browserSync.reload);
});

// build task
gulp.task('finalBuild', ['htmlpage', 'styles', 'imagemin', 'finalScripts']);

// default task
gulp.task('default', ['browser-sync']);
