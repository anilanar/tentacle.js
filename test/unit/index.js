var chai = require('chai');
var expect = require('chai').expect;
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var AngularMock = require('./angularMock');
var tentacleInit = require('../../src/index');

describe('tentacle', function () {
  var globalScope, angularMock, moduleName;

  beforeEach(function () {
    moduleName = 'tentacleModule';
    globalScope = {};
    angularMock = new AngularMock();
    tentacleInit(globalScope, angularMock);
  });

  it('should have tentacle in global scope', function () {
    expect(globalScope.tentacle).to.be.an('object');
  });

  it('should reset dirty properties in global scope', function () {
    // put dirty stuff into global scope
    angularMock.addService('x', ['dep0', 'dep1']);
    angularMock.addController('y', ['dep2', 'dep3']);
    angularMock.addDirective('z', ['dep4', 'dep5']);
    globalScope.tentacle.service('module', 'x');
    globalScope.tentacle.controller('module', 'y');
    globalScope.tentacle.directive('module', 'z');
    globalScope.tentacle.reset();
    expect(globalScope).to.eql({});
  });

  describe('async', function () {
    function testAsync() {
      var testObj = {};
      var res = globalScope.async(testObj);
      expect(globalScope.$q.when).to.have.been.calledOnce;
      expect(globalScope.$q.when).to.have.been.calledWith(testObj);
      expect(res).to.equal(testObj);
    }

    it('should wrap with $q even when $q is not injected yet', function () {
      testAsync();
    });

    it('should wrap with $q after some injection', function () {
      angularMock.addService('x', ['dep0', 'dep1']);
      globalScope.tentacle.service('module', 'x');
      testAsync();
    });
  });
});
