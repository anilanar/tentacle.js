module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['mocha'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/chai/chai.js',
      'node_modules/sinon-chai/lib/sinon-chai.js',
      'dist/tentacle.js',
      'test/integration/app.js',
      'test/integration/index.js'
    ],
    browsers: ['Firefox'],
    singleRun: true,
    reporters: [
      'mocha'
    ],
    plugins: [
      'karma-mocha',
      'karma-firefox-launcher',
      'karma-mocha-reporter'
    ]
  });
};
