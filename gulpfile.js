var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var browserify = require('browserify');
var Karma = require('karma').Server;
var source = require('vinyl-source-stream');
var del = require('del');

gulp.task('default', ['browserify'], function() {
});

function mochaTest() {
  return gulp.src('./test/unit/**/*.js', {read: false})
    .pipe(mocha({reporter: 'nyan'}));
}

gulp.task('test', ['mocha', 'karma'], function (done) {
  del(['.tmp'] ,done);
});

gulp.task('configure-istanbul', function () {
  return gulp.src(['src/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('mocha', function () {
  return mochaTest();
});

gulp.task('mocha-coverage', ['pre-test'], function () {
  return mochaTest()
  .pipe(istanbul.writeReports())
  .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});

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

gulp.task('karma', ['browserify', 'browserify-test'], function (done) {
  new Karma({
    configFile: __dirname + '/karma-unit.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('integration', ['browserify'], function (done) {
  new Karma({
    configFile: __dirname + '/karma-integration.conf.js',
    singleRun: true
  }, done).start();
});
