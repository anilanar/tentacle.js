(function (window, angular) {
  window.tentacle = {};

  var mockExceptions = [
    '$http',
    '$httpBackend',
    '$rootScope',
    '$q'
  ];

  var globalInjects = [
    '$rootScope',
    '$q'
  ];

  window.tentacle.mock = function (module, name, override, defaultMock) {
    angular.mock.module(module);
    override = override || {};
    defaultVal = defaultVal || {};

    var dependencies = getDependencies(module, name);
    dependencies = _.difference(dependencies, mockExceptions);

    var mocksObject = createMocksObject(dependencies, override, defaultMock);
    _.forEach(mocksObject, provideValue);
    return mocksObject;
  };

  window.tentacle.inject = function () {
    _.forEach(globalInjects, injectDependency);
  };

  window.tentacle.injectAll = function (module, name) {
    window.tentacle.inject();
    _.forEach(getDependencies(module, name), injectDependency);
    injectDependency(name);
  };

  function injectDependency(dependency) {
    angular.mock.inject([dependency, function (_dependency_) {
      window[dependency] = _dependency_;
    }]);
  }

  function getDependencies(module, name) {
    var invokeQueue = angular.module(module)._invokeQueue;
    return _.chain(invokeQueue)
      .unzip().last()
      .find(function (config) {
        return _.isEqual(config[0], name);
      })
      .last().initial().value();
  }

  function createMocksObject(dependencies, override, defaultMock) {
    return _.chain(dependencies)
      .reduce(function (mockObject, dependency) {
        mocksObject[dependency] = defaultMock;
        return mocksObject;
      }, {})
      .assign(override)
      .value();
  }

  function provideValue(mock, dependency) {
    angular.mock.module(function ($provide) {
      $provide.value(dependency, mock);
    });
  }

})(window, angular);
