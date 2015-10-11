module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['mocha'],
    files: [
      '.tmp/test.js'
    ],
    browsers: ['Chrome'],
  });
};
