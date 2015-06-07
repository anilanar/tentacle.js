(function (window, angular) {

  var dirtyProperties,
    mockExceptions,
    globalInjects;

  beforeEach(function () {
    dirtyProperties = [];
    mockExceptions = [
      '$http',
      '$httpBackend',
      '$rootScope',
      '$q',
      '$scope'
    ];

    globalInjects = [
      '$rootScope',
      '$q',
      '$httpBackend'
    ];

    addToWindow('tentacle', {});
    addToWindow('async', async);
    window.tentacle.mock = mock;
    window.tentacle.inject = inject;
    window.tentacle.injectAll = injectAll;
    window.tentacle.controller = controller;
  });

  afterEach(function () {
    deleteDirtyProperties();
  });

  function mock(module, name, override, defaultMock) {
    angular.mock.module(module);
    var mocksObject = createMocksObject(module, name, override, defaultMock);
    _.forEach(mocksObject, provideValue);
    return mocksObject;
  }

  function inject() {
    _.forEach(globalInjects, injectDependency);
  }

  function injectAll(module, name) {
    window.tentacle.inject();
    _.forEach(getDependencies(module, name), injectDependency);
    injectDependency(name);
  }

  function controller(module, name, override, defaultMock) {
    angular.mock.module(module);
    window.tentacle.inject();
    injectDependency('$controller');
    var mocksObject = createMocksObject(module, name, override, defaultMock);
    addToWindow('$scope', $rootScope.$new());
    _.extend(mocksObject, {
      $scope: window.$scope
    });
    window.tentacle.controller.run = function () {
      window.$controller(name, mocksObject);
    };
    return mocksObject;
  }

  function directive(module, name, override, defaultMock) {
    window.tentacle.mock(module, name, override, defaultMock);
    window.tentacle.inject();
    injectDependency('$compile');
    var mocksObject = createMocksObject(module, name, override, defaultMock);
    addToWindow('$scope', $rootScope.$new());
    _.extend(mocksObject, {
      $scope: window.$scope
    });
    window.tentacle.directive.run = function (element) {
      element = window.$compile(element)($scope);
      window.$scope.$digest();
      return element;
    };
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

  function deleteDirtyProperties() {
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
    defaultMock = defaultMock || {};

    var dependencies = getDependencies(module, name);
    dependencies = _.difference(dependencies, mockExceptions);
    return _.chain(dependencies)
      .reduce(function (mocksObject, dependency) {
        mocksObject[dependency] = defaultMock;
        return mocksObject;
      }, {})
      .assign(override)
      .value();
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

  function provideValue(mock, dependency) {
    angular.mock.module(function ($provide) {
      $provide.value(dependency, mock);
    });
  }
})(window, angular);
