var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', ['nodemon'], function () {
  browserSync.init({
    proxy: 'http://localhost:1234'
  });
  gulp.watch('public/sass/**/*.scss', ['sass']);
  gulp.watch(['public/dist/*.css', 'public/dist/*.js']).on('change', browserSync.reload);
});

gulp.task('sass', function () {
  return gulp.src('public/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/dist'))
    .pipe(browserSync.stream());
});

gulp.task('nodemon', function (callback) {
  var started = false;
  return nodemon({
    script: 'start.js',
    ignore: 'public'
  })
    .on('start', function () {
      if (!started) {
        callback();
        started = true;
      }
    });
});

gulp.task('default', ['browser-sync']);
