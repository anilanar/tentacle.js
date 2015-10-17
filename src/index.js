'use strict';

var _ = require('lodash');
module.exports = init;

function init(window, angular) {
  var dirtyProperties = [];
  var mockExceptions = [
    '$http',
    '$httpBackend',
    '$rootScope',
    '$q',
    '$scope',
    '$filter'
  ];
  var globalInjects = [
    '$rootScope',
    '$q',
    '$httpBackend',
    '$templateCache',
    '$compile'
  ];

  addToWindow('tentacle', {});
  addToWindow('async', async);
  window.tentacle.mock = mock;
  window.tentacle.injectGlobals = injectGlobals;
  window.tentacle.mockExceptions = mockExceptions;
  window.tentacle.globalInjects = globalInjects;
  window.tentacle.injectAll = injectAll;
  window.tentacle.controller = controller;
  window.tentacle.directive = directive;
  window.tentacle.service = service;
  window.tentacle.factory = service;
  window.tentacle.reset = reset;

  function mock(module, name, override, defaultMock) {
    angular.mock.module(module);
    var mocksObject = createMocksObject(module, name, override, defaultMock);
    _.forEach(mocksObject, provideValue);
    return mocksObject;
  }

  function injectGlobals() {
    _.forEach(globalInjects, injectDependency);
  }

  function injectAll(module, name) {
    window.tentacle.injectGlobals();
    var deps = getDependencies(module, name);
    var allDependencies = _.union(deps, globalInjects);
    _.forEach(allDependencies, injectDependency);
    injectDependency(name);
  }

  function controller(module, name, override, defaultMock) {
    angular.mock.module(module);
    window.tentacle.injectGlobals();
    injectDependency('$controller');
    var mocksObject = createMocksObject(module, name, override, defaultMock);
    addToWindow('$scope', window.$rootScope.$new());
    _.extend(mocksObject, {
      $scope: window.$scope
    });
    window.tentacle.controller.run = function () {
      var ctrl = window.$controller(name, mocksObject);
      window.$scope.$digest();
      return ctrl;
    };
    return mocksObject;
  }

  function directive(module, name, override, defaultMock) {
    var mocksObject = window.tentacle.mock(module, name, override, defaultMock);
    window.tentacle.injectGlobals();
    addToWindow('$scope', window.$rootScope.$new());
    _.extend(mocksObject, {
      $scope: window.$scope
    });
    window.tentacle.directive.run = function (element) {
      element = window.$compile(element)(window.$scope);
      window.$scope.$digest();
      return element;
    };
    return mocksObject;
  }

  function service(module, name, override, defaultMock) {
    var mocksObject = window.tentacle.mock(module, name, override, defaultMock);
    window.tentacle.injectGlobals();
    injectDependency(name);
    return mocksObject;
  }

  function async(x) {
    if (!window.$q) {
      injectDependency('$q');
    }
    return window.$q.when(x);
  }

  function addToWindow(propertyName, value) {
    window[propertyName] = value;
    dirtyProperties.push(propertyName);
  }

  function reset() {
    _.forEach(dirtyProperties, function (prop) {
      delete window[prop];
    });
  }

  function injectDependency(dependency) {
    angular.mock.inject([dependency, function (_dependency_) {
      addToWindow(dependency, _dependency_);
    }]);
  }

  function createMocksObject(module, name, override, defaultMock) {
    override = override || {};

    var dependencies = getDependencies(module, name);
    dependencies = _.difference(dependencies, mockExceptions);
    return _.chain(dependencies)
      .reduce(function (mocksObject, dependency) {
        mocksObject[dependency] = defaultMock || {};
        return mocksObject;
      }, {})
      .assign(override)
      .value();
  }

  function getDependencies(module, name) {

    var invokeQueue = angular.module(module)._invokeQueue;
    // depArr is an array-like object
    // it has no length property
    var depArr = _.chain(invokeQueue)
      .unzip().last()
      .find(function (config) {
        return _.isEqual(config[0], name);
      }).value();
    return _.initial(depArr[1]);
  }

  function provideValue(mock, dependency) {
    angular.mock.module(function ($provide) {
      $provide.value(dependency, mock);
    });
  }
}
