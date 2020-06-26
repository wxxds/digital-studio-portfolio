
'use strict';

/** ---------------------------------------------------------------------------
 * Load plugins
 * ------------------------------------------------------------------------- */

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var minifyJS = require('gulp-uglify');
var concatJS = require('gulp-concat');
var includeJS = require('gulp-include');
var cssNano = require('gulp-cssnano');
var gulpIf = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var replace = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var svgSprites = require('gulp-svg-sprites');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var panini = require('panini');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var browser = require('browser-sync').create();
var sequence = require('run-sequence');
var del = require('del');
var ftp = require('vinyl-ftp');
var yargs = require('yargs');

// Custom
var htmlmin = require('gulp-htmlmin');

/** ---------------------------------------------------------------------------
 * Load settings.
 * ------------------------------------------------------------------------- */

const CONFIG = require('./config.json');
const PATHS = CONFIG.PATH;


/** ---------------------------------------------------------------------------
 * Look for the --production flag.
 * ------------------------------------------------------------------------- */

const PRODUCTION = yargs.argv.production;

console.log("=====================")
console.log("=====================")
console.log("ENV: prod?")
console.log("=====================")
console.log(PRODUCTION)

/** ---------------------------------------------------------------------------
 * Regular tasks.
 * ------------------------------------------------------------------------- */

// Deletes the dist folder so the build can start fresh.
gulp.task('reset', function() {
  return del(PATHS.dist);
});

// Copies the necessary files from src to dist.
gulp.task('copy', function() {
  return gulp.src(CONFIG.COPY).pipe(gulp.dest(PATHS.dist));
});

// Compiles Handlebars templates with Panini.
gulp.task('pages', function() {
  return (
    gulp
      .src(PATHS.src + '/pages/**/*.hbs')
      .pipe(panini(CONFIG.PANINI))
      // .pipe(gulpIf(PRODUCTION, replace('.css"', '.min.css"')))
      // .pipe(gulpIf(PRODUCTION, replace('core.js', 'core.min.js')))
      .pipe(
        rename({
          extname: '.html'
        })
      )
      .pipe(gulpIf(PRODUCTION, htmlmin({ collapseWhitespace: true })))
      .pipe(gulp.dest(PATHS.dist))
  );
});

// Creates a server with BrowserSync and watch for file changes.
gulp.task('server', function() {
  browser.init(CONFIG.SERVER);

  // Watch for file changes.
  gulp.watch(PATHS.src + '/{data,helpers,layouts,pages,partials}/**/*', ['watch-html']);
  gulp.watch(PATHS.src_css + '/**/*.scss', ['sass']);
  gulp.watch(PATHS.src_js + '/**/*.js', ['watch-js']);
  gulp.watch([PATHS.src_img + '/**/*.{png,jpg,gif,svg,ico}', '!' + PATHS.src_img + '/sprites/**'], ['watch-img']);
  gulp.watch(PATHS.src_img + '/sprites/**/*.svg', ['sprites']);
});

// Compiles Sass to CSS.
gulp.task('sass', function() {
  return gulp
    .src(PATHS.src_css + '/**/*.scss')
    .pipe(gulpIf(!PRODUCTION, sourcemaps.init()))
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'Gulp error in the <%= error.plugin %> plugin',
          message: '<%= error.message %>'
        })
      })
    )
    .pipe(
      sass({
        outputStyle: 'expanded'
      })
    )
    .pipe(autoprefixer(CONFIG.AUTOPREFIXER))
    .pipe(replace('/**/', ''))
    .pipe(plumber.stop())
    .pipe(gulpIf(!PRODUCTION, sourcemaps.write('/maps')))
    .pipe(gulpIf(PRODUCTION, cssNano()))
    .pipe(gulp.dest(PATHS.dist_css))
    .pipe(browser.stream());
});

// Concatenate and minify JS.
gulp.task('js', function() {
  return gulp
    .src([PATHS.src_js + '/core.js'])
    .pipe(gulpIf(!PRODUCTION, sourcemaps.init()))
    .pipe(includeJS())
    .pipe(concatJS('core.js'))
    .pipe(gulpIf(!PRODUCTION, sourcemaps.write('/maps')))
    .pipe(
      gulpIf(
        PRODUCTION,
        minifyJS().on('error', function(e) {
          console.log(e);
        })
      )
    )
    .pipe(gulp.dest(PATHS.dist_js))
    .pipe(browser.stream());
});

// Minify JS init.
gulp.task('js-init', function() {
  return gulp
    .src([PATHS.src_js + '/init.js'])
    .pipe(
      gulpIf(
        PRODUCTION,
        minifyJS().on('error', function(e) {
          console.log(e);
        })
      )
    )
    .pipe(gulp.dest(PATHS.dist_js))
    .pipe(browser.stream());
});

// Check JS code for errors.
gulp.task('lint-js', function() {
  return gulp
    .src([PATHS.src_js + '/init.js', '!' + PATHS.src_js + '/{cdn-fallback,vendor}/**/*'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail')); // task fails on JSHint error
});

// Creates sprites from SVG files.
gulp.task('sprites', function() {
  return gulp
    .src(PATHS.src_img + '/sprites/**/*.svg')
    .pipe(
      svgSprites({
        cssFile: 'assets/scss/components/_sprites.scss',
        common: 'icon-svg',
        padding: 0,
        baseSize: 10,
        templates: {
          scss: true
        },
        preview: false,
        svg: {
          sprite: 'assets/img/sprite.svg'
        },
        svgPath: '../img/sprite.svg',
        pngPath: '../img/sprite.svg'
      })
    )
    .pipe(gulp.dest(PATHS.src));
});

// Compresses images.
gulp.task('img', function() {
  return gulp
    .src([PATHS.src_img + '/**/*.{png,jpg,gif,svg,ico}', '!' + PATHS.src_img + '/*.{svg}', '!' + PATHS.src_img + '/sprites/**'])
    .pipe(
      gulpIf(
        PRODUCTION,
        imagemin([imagemin.optipng({ optimizationLevel: 3 }), imagemin.jpegtran({ progressive: true })], {
          verbose: true
        })
      )
    )
    .pipe(gulp.dest(PATHS.dist_img));
});



/** ---------------------------------------------------------------------------
 * Watch tasks
 * ------------------------------------------------------------------------- */

// HTML
gulp.task('watch-html', ['panini-refresh', 'pages'], function(done) {
  browser.reload();
  done();
});

// JS
gulp.task('watch-js', ['js', 'js-init'], function(done) {
  browser.reload();
  done();
});

// Images
gulp.task('watch-img', ['img'], function(done) {
  browser.reload();
  done();
});



/** ---------------------------------------------------------------------------
 * Other tasks.
 * ------------------------------------------------------------------------- */

// Refresh Panini.
gulp.task('panini-refresh', function() {
  panini.refresh();
});

// Compiles Bootstrap.
gulp.task('bootstrap', function() {
  return gulp
    .src(PATHS.src + '/assets/vendor/bootstrap/scss/*.scss')
    .pipe(gulpIf(!PRODUCTION, sourcemaps.init()))
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'Gulp error in the <%= error.plugin %> plugin',
          message: '<%= error.message %>'
        })
      })
    )
    .pipe(
      sass({
        outputStyle: 'compressed'
      })
    )
    .pipe(autoprefixer(CONFIG.AUTOPREFIXER))
    .pipe(replace('/**/', ''))
    .pipe(plumber.stop())
    .pipe(gulpIf(!PRODUCTION, sourcemaps.write('/maps')))
    .pipe(gulpIf(PRODUCTION, cssNano()))
    .pipe(gulp.dest(PATHS.dist + '/assets/vendor/bootstrap/css'))
    .pipe(browser.stream());
});

/** ---------------------------------------------------------------------------
 * Main tasks.
 * ------------------------------------------------------------------------- */

gulp.task('build', function(cb) {
  sequence('reset', ['copy', 'pages', 'sprites'], ['sass', 'bootstrap', 'js', 'js-init', 'img'], cb);
});

gulp.task('default', function(cb) {
  sequence('build', 'server', cb);
});


// Copies all files
gulp.task('export', function() {
  return gulp
    .src([PATHS.src + '/**', PATHS.dist + '/**', '.editorconfig', 'config.json', 'gulpfile.js', 'package.json', 'package-lock.json'], {
      base: '.'
    })
    .pipe(gulp.dest('../escapium-for-buyers/EXPORT'));
});

// Copies all files
gulp.task('export', function() {
  return gulp
    .src([PATHS.src + '/**', PATHS.dist + '/**', '.editorconfig', 'config.json', 'gulpfile.js', 'package.json', 'package-lock.json'], {
      base: '.'
    })
    .pipe(gulp.dest('../necromancers-for-buyers/EXPORT'));
});
