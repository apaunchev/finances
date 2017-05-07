var gulp = require('gulp')
var stylus = require('gulp-stylus')
var browserSync = require('browser-sync').create()

gulp.task('stylus', function () {
  return gulp.src('src/stylus/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream())
})

gulp.task('serve', function () {
  browserSync.init({
    server: ['./', 'public/']
  })
  gulp.watch('src/stylus/*.styl', ['stylus'])
  gulp.watch('public/templates/*.html').on('change', browserSync.reload)
  gulp.watch('public/js/**/*.js').on('change', browserSync.reload)
})

gulp.task('default', ['serve'])
