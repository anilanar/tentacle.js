var chai = require('chai');
var expect = require('chai').expect;
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var AngularMock = require('./angularMock');
var commonInit = require('./common');
var tentacleInit = require('../../src/index');

describe('services', function () {
  var moduleName, serviceName, angularMock, globalScope, common;
  beforeEach(function () {
    moduleName = 'tentacleModule';
    globalScope = {};
    common = commonInit(globalScope, moduleName);
    angularMock = new AngularMock();
    tentacleInit(globalScope, angularMock);
    serviceName = 'tentacleService';
    angularMock.addService(serviceName, ['dep0', 'dep1']);
  });

  it('should inject all', function () {
    common.injectAllTest(serviceName);
  });

  it('should inject global dependencies', function () {
    common.injectGlobalTest(serviceName);
  });

  it('should mock', function () {
    var mocks = globalScope.tentacle.service(moduleName, serviceName);
    expect(mocks.dep0).to.eql({});
    expect(mocks.dep1).to.eql({});
  });
});
