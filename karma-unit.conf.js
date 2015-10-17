module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['mocha'],
    files: [
      '.tmp/test.js'
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
