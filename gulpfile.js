var gulp = require('gulp'),
uglify = require('gulp-uglify');

gulp.task('default', function () {
gulp.src('src/resize.js')
    .pipe(uglify())
    .pipe(gulp.dest('build'))
});