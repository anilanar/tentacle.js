[![Build Status](https://travis-ci.org/anilanar/tentacle.js.svg?branch=master)](https://travis-ci.org/anilanar/tentacle.js)
[![Coverage Status](https://coveralls.io/repos/anilanar/tentacle.js/badge.svg?branch=master&service=github)](https://coveralls.io/github/anilanar/tentacle.js?branch=master)
[![npm version](https://badge.fury.io/js/tentacle.js.svg)](https://badge.fury.io/js/tentacle.js)

This utility library is unstable and experimental. You don't have to use it for all of your test suites. Give it a try for testing one of your services/controllers/directives!


# tentacle.js
---------------
Auto-mock dependencies for angular.js tests. See integration tests for examples.

Injecting or mocking dependencies is supported for services/factories, controllers and directives.

Filters and providers currently are not supported. However services returned by providers can be tested using tentacle.js.


### Table of Contents
1. [Installation](#1-installation)
2. [First steps](#2-first-steps)
3. [API and examples](#3-api-and-examples)
  - [`tentacle.injectAll`](#tentacleinjectAll)
  - [`tentacle.service`](#tentacleservice)
  - [`tentacle.factory`](#tentaclefactory)
  - [`tentacle.controller`](#tentaclecontroller)
  - [`tentacle.controller.run`](#tentaclecontrollerrun)
  - [`tentacle.directive`](#tentacledirective)
  - [`tentacle.directive.run`](#tentacledirectiverun)
  - [`tentacle.reset`](#tentaclereset)
4. [Advanced](#4-advanced)
  - [How it works](#how-it-works)
  - [`tentacle.globalInjects`](#tentacleglobalinjects)
  - [`tentacle.mockExceptions`](#tentaclemockexceptions)

### 1. Installation

##### npm:
```
npm install tentacle.js
```
##### bower:
```
bower install tentacle.js
```

### 2. First steps

##### node.js:
```js
var tentacleInit = require('tentacle');
var angular = require('angular');
var globalScope = {}; // you can use global too,
                      // similar to window object
                      // in browsers
tentacleInit(global, angular)

// You can use globalScope.tentacle

describe('test', function () {
  it('should have tentacle', function () {
    expect(globalScope.tentacle).to.be.an.object;
    // if you use 'global' object:
    // expect(tentacle).to.be.an.object;
  });
});
```

##### browsers (karma):

Add [dist/tentacle.js](dist/tentacle.js) to your files list in karma config. `tentacle` object is put into `window` global variable:

```js
describe('test', function () {
  it('should have tentacle', function () {
    expect(tentacle).to.be.an.object;
  });
});
```

### 3. API and examples:

---
#### `tentacle.injectAll`
Injects all dependencies given a module name and a service, factory, controller or directive name.

###### Arguments

| Param      | Type    | Details    
| ---------- | ------- | ----------
| moduleName | string  | name of angular module
| name       | string  | name of service/factory/ctrl/directive

---

#### `tentacle.service`
#### `tentacle.factory`
Mocks all dependencies of an angular service, except those defined in `tentacle.mockExceptions`.

###### Usage
```js
// a simple service
angular.module('myModule').factory('myService', [
  'anotherService',
  function (anotherService) {
    return {
      myMethod: function () {
        anotherService.anotherMethod();
      };
    }
  }]);

// ----------------

// test
var mocks = tentacle.service('myModule', 'myService');
mocks.anotherService.anotherMethod = function () {
  return 'HELLO';
};
expect(myService.myMethod()).to.equal('HELLO');
```

###### Arguments

| Param       | Type    | Details    
| ----------- | ------- | ----------
| moduleName  | string  | name of angular module
| serviceName | string  | name of service
| customMocks | object  | _(optional)_ string-value pairs for overriding default mock object. defaults to an empty object
| defaultMock | any     | _(optional)_ value to inject for mocked dependencies. provided values are deeply cloned before each injection. defaults to an empty object

###### Returns
`object{string: any}` : string-value pairs of mocked dependency names and their values

---

#### `tentacle.controller`
Mocks all dependencies of an angular controller, except those defined in `tentacle.mockExceptions`.

###### Usage
```js
// a simple controller
angular.module('myModule').controller('myCtrl', [
  '$scope',
  'anotherService',
  function ($scope, anotherService) {
    this.myMethod = function () {
      anotherService.anotherMethod();
    }
    $scope.myValue = this.myMethod();
  }]);

// ----------------

// test
var mocks = tentacle.controller('myModule', 'myCtrl');
mocks.anotherService.anotherMethod = function () {
  return 'HELLO';
};
var ctrl = tentacle.controller.run();
expect(ctrl.myMethod()).to.equal('HELLO');
expect($scope.myValue).to.equal('HELLO');
```

###### Arguments

| Param       | Type    | Details    
| ----------- | ------- | ----------
| moduleName  | string  | name of angular module
| ctrlName    | string  | name of controller
| customMocks | object  | _(optional)_ string-value pairs for overriding default mock object. defaults to an empty object
| defaultMock | any     | _(optional)_ value to inject for mocked dependencies. provided values are deeply cloned before each injection. defaults to an empty object

###### Returns
`object{string: any}` : string-value pairs of mocked dependency names and their values

---

#### `tentacle.controller.run`
Executes the last controller that was initialized using `tentacle.controller`.

###### Returns
`object : instance of controller

---

#### `tentacle.directive`
Mocks all dependencies of an angular controller, except those defined in `tentacle.mockExceptions`.

###### Usage
```js
// a simple directive
angular.module('myModule').directive('myDir', [
  'anotherService',
  function (anotherService) {
    function link ($scope) {
      $scope.myValue = anotherService.anotherMethod();
    }
    return {
      restrict: 'EA',
      scope: {
        'myParam': '='
      },
      template: '<p>{{myParam}}</p>'
    }
  }]);

// ----------------

// test
var mocks = tentacle.directive('myModule', 'myDir');
mocks.anotherService.anotherMethod = function () {
  return 'HELLO';
};
var elem = tentacle.directive.run('<my-dir my-param="param"></my-dir');
expect(isolateScope.myValue).to.equal('HELLO');
$scope.param = 'tentacle.js';
$scope.$digest();
var isolateScope = elem.isolateScope();
expect(isolateScope.myParam).to.equal('tentacle.js');
```

###### Arguments

| Param       | Type    | Details    
| ----------- | ------- | ----------
| moduleName  | string  | name of angular module
| dirName     | string  | name of directive
| customMocks | object  | _(optional)_ string-value pairs for overriding default mock object. defaults to an empty object
| defaultMock | any     | _(optional)_ value to inject for mocked dependencies. provided values are deeply cloned before each injection. defaults to an empty object

###### Returns
`object{string: any}` : string-value pairs of mocked dependency names and their values

---

#### `tentacle.directive.run`
Executes the last controller that was initialized using `tentacle.controller`.

| Param   | Type    | Details    
| ------- | ------- | ----------
| html    | string  | html to use for initializing directive. it must have an element that resolves to tested directive at **root**

###### Returns
`object` : an instance of [`angular.element`](https://docs.angularjs.org/api/ng/function/angular.element). the following methods are especially important for testing:
- `scope()`: returns scope
- `isolateScope()`: returns isolate scope if directive is defined to have one
- `controller('directiveName')`: returns controller that was set in directive definition using `controller` property.

---

### 4. Advanced
You can read the following for more advanced information on _tentacle.js_.

#### How it works
When dependencies are injected or mocked using _tentacle.js_, dependencies for given service, controller or directive are searched in `angular._invokeQueue`, a private/undocumented property of _angular_.

Dependencies in `tentacle.globalInjects` are always injected in the global scope while dependencies in `tentacle.mockExceptions` are never mocked.

#### `tentacle.globalInjects`
You can push more dependencies into this array. It is defined as follows:

```js
tentacle.globalInjects = [
  '$rootScope',
  '$q',
  '$httpBackend',
  '$templateCache',
  '$compile'
];
```

#### `tentacle.mockExceptions`
You can push more dependencies into this array. It is defined as follows:

```js
tentacle.mockExceptions = [
  '$http',
  '$httpBackend',
  '$rootScope',
  '$q',
  '$scope',
  '$filter'
];
```
