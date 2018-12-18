const gulp = require('gulp');
const babel = require("gulp-babel");
const uglify = require('gulp-uglify-es').default;

gulp.task('default', function () {
  gulp.src('src/*.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('build'))
});