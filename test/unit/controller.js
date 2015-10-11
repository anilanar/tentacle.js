/* jshint -W030 */
var chai = require('chai');
var expect = require('chai').expect;
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var AngularMock = require('./angularMock');
var commonInit = require('./common');
var tentacleInit = require('../../src/index');

describe('controllers', function () {
  var moduleName, ctrlName, angularMock, globalScope, common;
  beforeEach(function () {
    moduleName = 'tentacleModule';
    globalScope = {};
    common = commonInit(globalScope, moduleName);
    angularMock = new AngularMock();
    tentacleInit(globalScope, angularMock);
    ctrlName = 'tentacleCtrl';
    angularMock.addController(ctrlName, ['dep0', 'dep1']);
  });

  it('should inject all', function () {
    common.injectAllTest(ctrlName);
  });

  it('should inject global dependencies', function () {
    common.injectGlobalTest(ctrlName);
  });

  describe('mock', function () {
    var mocks;
    beforeEach(function () {
      mocks = globalScope.tentacle.controller(moduleName, ctrlName);
    });

    it('should mock', function () {
      expect(mocks.dep0).to.eql({});
      expect(mocks.dep1).to.eql({});
    });

    it('should create new scope', function () {
      expect(globalScope.$rootScope.$new).to.have.been.calledOnce;
    });

    it('should put $scope in mocks object', function () {
      expect(mocks.$scope).to.be.an('object');
      expect(mocks.$scope.isScope).to.be.true;
    });

    it('should put $scope in global scope', function () {
      expect(globalScope.$scope).to.be.an('object');
      expect(mocks.$scope.isScope).to.be.true;
    });

    describe('run', function () {
      var ctrl;
      beforeEach(function () {
        ctrl = globalScope.tentacle.controller.run();
      });
      it('should run controller using $controller', function () {
        expect(globalScope.$controller).to.have.been.calledOnce;
      });
      it('should return controller instance', function () {
        expect(globalScope.$controller).to.have.returned(ctrl);
      });
      it('should have called $controller with mocked dependencies', function () {
        var call = globalScope.$controller.getCall(0);
        var depsArg = call.args[1];
        expect(depsArg.dep0).to.equal(mocks.dep0);
        expect(depsArg.dep1).to.equal(mocks.dep1);
      });
      it('should have called $controller with newly created scope', function () {
        var call = globalScope.$controller.getCall(0);
        var depsArg = call.args[1];
        expect(depsArg.$scope).to.equal(mocks.$scope);
      });
      it('should digest the scope after executing $controller', function () {
        expect(mocks.$scope.$digest).to.have.been.calledOnce;
        expect(mocks.$scope.$digest).to.have.been.calledAfter(globalScope.$controller);
      });
    });
  });
});
