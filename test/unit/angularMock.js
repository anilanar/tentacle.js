var sinon = require('sinon');
var _ = require('lodash');

module.exports = AngularMock;

function mock(provider, type, name, deps) {
  deps = _.cloneDeep(deps);
  // push implementation function, mimicing [deps.., function(deps) {..}]
  // notation of angular.
  deps.push(function(){});
  // [name, deps] mimics (name, [deps.., function(deps {..})]) notation.
  // {0: name, 1:deps} is an array-like object that is used by Angular.
  return [provider, type, {0: name, 1:deps}];
}

// util functions for easy mocking, respecting actual values in angular's
// _invokeQueue property.
var controller = _.partial(mock, '$controllerProvider', 'controller');
var service = _.partial(mock, '$provide', 'factory');
var directive = _.partial(mock, '$compileProvider', 'directive');

function AngularMock() {
  var self = this;
  self.invokeQueue = [];
  self.module = sinon.stub().returns({
    _invokeQueue: self.invokeQueue
  });
  self.mock = {
    module: function(x) {
      if (typeof x === 'function') {
        x({
          value: sinon.stub()
        });
      }
    },
    inject: _.bind(self.inject, self)
  };
  self.directiveMock = {
    element: {isElement: true},
    templateFn: sinon.stub()
  };
  self.directiveMock.templateFn.returns(self.directiveMock.element);
  self.customMocks = {
    $rootScope: _.memoize(function () {
      return {
        __name: '$rootScope',
        $new: sinon.stub().returns({
          name: '$scope',
          isScope: true,
          $digest: sinon.stub()
        })
      };
    }),
    $scope: _.memoize(function () {
      throw new Error('$scope should not be injected using injector');
    }),
    $controller: _.memoize(function () {
      var resolved = sinon.stub().returns({isController: true});
      resolved.__name = '$controller';
      return resolved;
    }),
    $compile: _.memoize(function () {
      var resolved = sinon.stub().returns(self.directiveMock.templateFn);
      resolved.__name = '$compile';
      return resolved;
    }),
    $q: _.memoize(function () {
      return {
        __name: '$q',
        when: sinon.stub().returnsArg(0)
      };
    })
  };
}

AngularMock.prototype.addService = function(name, deps) {
  var self = this;
  self.invokeQueue.push(service(name, deps));
};

AngularMock.prototype.addController = function(name, deps) {
  var self = this;
  self.invokeQueue.push(controller(name, deps));
};

AngularMock.prototype.addDirective = function(name, deps) {
  var self = this;
  self.invokeQueue.push(directive(name, deps));
};

AngularMock.prototype.inject = function(injection) {
  var self = this;
  var dep = injection[0];
  var impl = injection[1];

  var resolved;
  if (self.customMocks[dep]) {
    resolved = self.customMocks[dep]();
  }
  else {
    resolved = {__name: dep};
  }
  impl(resolved);
};
