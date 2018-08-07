var gulp = require('gulp'),
    babel = require("gulp-babel"), 
    uglify = require('gulp-uglify');

gulp.task('default', function () {
gulp.src('src/*.js')
    .pipe(babel()) 
    .pipe(uglify())
    .pipe(gulp.dest('build'))
});