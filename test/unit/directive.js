var chai = require('chai');
var expect = require('chai').expect;
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var AngularMock = require('./angularMock');
var commonInit = require('./common');
var tentacleInit = require('../../src/index');

describe('directive', function () {
  var moduleName, dirName, angularMock, globalScope, common;
  beforeEach(function () {
    moduleName = 'tentacleModule';
    globalScope = {};
    common = commonInit(globalScope, moduleName);
    angularMock = new AngularMock();
    tentacleInit(globalScope, angularMock);
    dirName = 'tentacleCtrl';
    angularMock.addDirective(dirName, ['dep0', 'dep1']);
  });
  beforeEach(function () {
    dirName = 'tentacleDir';
    angularMock.addDirective(dirName, ['dep0', 'dep1']);
  });

  it('should inject all', function () {
    common.injectAllTest(dirName);
  });

  it('should inject global dependencies', function () {
    common.injectGlobalTest(dirName);
  });

  describe('mock', function () {
    var mocks;
    beforeEach(function () {
      mocks = globalScope.tentacle.directive(moduleName, dirName);
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
      var elem;
      var compiledElem;
      beforeEach(function () {
        elem = '<p>Html element</p>';
        compiledElem = globalScope.tentacle.directive.run(elem);
      });
      it('should run directive using $compile', function () {
        expect(globalScope.$compile).to.have.been.calledOnce;
      });
      it('should pass html element to $compile', function () {
        expect(globalScope.$compile).to.have.been.calledWith(elem);
      });
      it('should run directive using newly created scope', function () {
        expect(angularMock.directiveMock.templateFn)
          .to.have.been.calledWith(mocks.$scope);
      });
      it('should return element instance', function () {
        expect(compiledElem).to.equal(angularMock.directiveMock.element);
      });
      it('should digest the scope after executing template function', function () {
        expect(mocks.$scope.$digest).to.have.been.calledOnce;
        expect(mocks.$scope.$digest)
          .to.have.been.calledAfter(angularMock.directiveMock.templateFn);
      });
    });
  });
});
