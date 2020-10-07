'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sourcemap = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();
var rename = require('gulp-rename');
var del = require('del');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var csso = require('gulp-csso');
var posthtml = require('gulp-posthtml');
var include = require('posthtml-include');

gulp.task('css', function () {
  return gulp.src('src/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(posthtml([ include() ]))
    .pipe(gulp.dest('build'));
});

gulp.task('copy-js', function() {
  return gulp.src('source/js/**', {
    base: 'source'
  })
  .pipe(gulp.dest('build'));
})

gulp.task('refresh', function(done) {
  server.reload();
  done();
});

gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('src/sass/**/*.{scss,sass}', gulp.series('css'));
  gulp.watch('src/js/*.js', gulp.series('copy-js', 'refresh'));
  gulp.watch('src/*.html', gulp.series('html', 'refresh'));
});

gulp.task('copy', function() {
  return gulp.src([
    'src/css/normalize.css',
    'src/fonts/**/*.{woff,woff2}',
    'src/js/**',
    'src/*.ico'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('clear', function() {
  return del('build');
});

gulp.task('build', gulp.series('clear', 'copy', 'css', 'html'));
gulp.task('start', gulp.series('build', 'server'));
