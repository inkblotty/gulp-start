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


var paths = {
	scripts: {
		source: [ '!node_modules', './src/scripts/lib.js', './src/scripts/**/*.js' ],
		build: './build/scripts'
	},
	styles: {
		source: [ './src/styles/**/*.scss' ],
		build: './build/styles'
	},
	images: {
		source: [ './src/images/**/*' ],
		build: './build/images'
	},
	markup: {
		source: [ './src/**/*.html' ],
		build: './build'
	}
}

// JS hint task
gulp.task('jshint', function() {
	gulp.src(paths.scripts.source)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function() {
	var imgSrc = paths.images.source,
		imgDst = paths.images.build;

	gulp.src(imgSrc)
		.pipe(changed(imgDst))
		.pipe(imagemin())
		.pipe(gulp.dest(imgDst));
});

// minify html
gulp.task('htmlpage', function() {
	var htmlSrc = paths.markup.source,
		htmlDst = paths.markup.build;

	gulp.src(htmlSrc)
		.pipe(changed(htmlDst))
		.pipe(minifyHTML())
		.pipe(gulp.dest(htmlDst));
});

// JS concat -- just for debugging
gulp.task('scripts', function() {
	gulp.src(paths.markup.source)
		.pipe(concat('script.js'))
		.pipe(gulp.dest(paths.markup.build));
});

// JS concat, strip debugging, and uglify -- for final build
gulp.task('finalScripts', function(){
	gulp.src(paths.markup.source)
	  .pipe(concat('script.js'))
	  .pipe(strigDebug())
	  .pipe(uglify())
	  .pipe(gulp.dest(paths.markup.build));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
	gulp.src(paths.styles.source)
		.pipe(sass().on('error', sass.logError))
		.pipe(changed(paths.styles.source))
		.pipe(concat('styles.css'))
		.pipe(autoprefix('last 2 versions'))
		.pipe(minifyCSS())
		.pipe(gulp.dest(paths.styles.build));
});

// browsersync
gulp.task('browser-sync', function(){
  browserSync.init({
  server: {
            baseDir: paths.markup.build
        },
  notify: false
  });
  gulp.watch(paths.markup.source, ['htmlpage']).on('change', browserSync.reload);
  gulp.watch(paths.styles.source, ['styles']).on('change', browserSync.reload);
  gulp.watch(paths.scripts.source, ['jshint', 'scripts']).on('change', browserSync.reload);
});

// build task
gulp.task('finalBuild', ['htmlpage', 'styles', 'imagemin', 'finalScripts']);

// default task
gulp.task('default', ['browser-sync']);
