var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('browserify', function() {
  return browserify('src/standalone.js')
    .bundle()
    .pipe(source('tentacle.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('browserify-test', function() {
  return browserify('./test/karmaEntry.js')
    .bundle()
    .pipe(source('test.js'))
    .pipe(gulp.dest('.tmp'));
});
