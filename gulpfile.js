var jshint = require('gulp-jshint');
var gulp   = require('gulp');

gulp.task('lint', function() {
  return gulp.src(['**/*.js',
  '!./node_modules/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
