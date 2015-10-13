var expect = chai.expect;

describe('tentacle', function () {
  it('should inject all', function () {
    // injectAll assumes all required modules are
    // already initialized, that's why we initialize
    // 'tentacleApp' module.
    module('tentacleApp');
    tentacle.injectAll('tentacleApp', 'tentacleService');
    expect(serviceDep1.name).to.equal('serviceDep1');
    expect(serviceDep2.name).to.equal('serviceDep2');
  });

  it('should mock service', function () {
    var mocks = tentacle.service('tentacleApp', 'tentacleService');
    expect(mocks.serviceDep1).to.eql({});
    expect(mocks.serviceDep2).to.eql({});
    expect(tentacleService.serviceDep1).to.eql({});
    expect(tentacleService.serviceDep2).to.eql({});
  });

  describe('controller', function () {
    it('should mock', function () {
      var mocks = tentacle.controller('tentacleApp', 'tentacleCtrl');
      expect(mocks.serviceDep1).to.eql({});
      expect(mocks.serviceDep2).to.eql({});
    });

    it('should mock using custom mocks', function () {
      var serviceDep1 = {name: 'serviceDep1'};
      var serviceDep2 = function() { return 'serviceDep2'; };
      var mocks = tentacle.controller('tentacleApp', 'tentacleCtrl', {
        serviceDep1: serviceDep1,
        serviceDep2: serviceDep2
      });
      expect(mocks.serviceDep1).to.equal(serviceDep1);
      expect(mocks.serviceDep2).to.equal(serviceDep2);
      expect(mocks.serviceDep1.name).to.equal('serviceDep1');
      expect(mocks.serviceDep2()).to.equal('serviceDep2');
    });

    it('should run', function () {
      var mocks = tentacle.controller('tentacleApp', 'tentacleCtrl');
      tentacle.controller.run();
      expect(mocks.qTest.test).to.be.true;
    });

    it('should run and return controller instance', function () {
      var mocks = tentacle.controller('tentacleApp', 'tentacleCtrl');
      var ctrl = tentacle.controller.run();
      expect(ctrl.serviceDep1).to.eql({});
      expect(ctrl.serviceDep2).to.eql({});
    });

    it('should have same mock objects in mocks, injected to controller', function () {
      var mocks = tentacle.controller('tentacleApp', 'tentacleCtrl');
      var ctrl = tentacle.controller.run();
      expect(mocks.serviceDep1).to.equal(ctrl.serviceDep1);
      expect(mocks.serviceDep2).to.equal(ctrl.serviceDep2);
    });
  });

  describe('directive', function () {
    it('should mock', function () {
      var mocks = tentacle.directive('tentacleApp', 'tentacleDir');
      expect(mocks.serviceDep1).to.eql({});
      expect(mocks.serviceDep2).to.eql({});
    });

    it('should mock using custom mocks', function () {
      var serviceDep1 = {name: 'serviceDep1'};
      var serviceDep2 = function() { return 'serviceDep2'; };
      var mocks = tentacle.directive('tentacleApp', 'tentacleCtrl', {
        serviceDep1: serviceDep1,
        serviceDep2: serviceDep2
      });
      expect(mocks.serviceDep1).to.equal(serviceDep1);
      expect(mocks.serviceDep2).to.equal(serviceDep2);
      expect(mocks.serviceDep1.name).to.equal('serviceDep1');
      expect(mocks.serviceDep2()).to.equal('serviceDep2');
    });

    it('should run', function () {
      var mocks = tentacle.directive('tentacleApp', 'tentacleCtrl');
      tentacle.directive.run('<div tentacle-dir></div>');
      expect(mocks.qTest.test).to.be.true;
    });

    it('should run and return element', function () {
      var mocks = tentacle.directive('tentacleApp', 'tentacleDir');
      var elem = tentacle.directive.run('<div tentacle-dir></div>');
      // TODO: if someone has a better way of checking if it is angular.element:
      expect(elem.html()).to.equal('<h1>tentacle.js</h1>');
      expect(elem.controller).to.be.a.function;
      expect(elem.isolateScope).to.be.a.function;
      expect(elem.scope).to.be.a.function;
    });

    it('should have same mock objects in mocks, injected to controller', function () {
      var mocks = tentacle.directive('tentacleApp', 'tentacleCtrl');
      tentacle.directive.run('<div tentacle-dir></div>');
      expect(mocks.serviceDep1).to.equal($scope.serviceDep1);
      expect(mocks.serviceDep2).to.equal($scope.serviceDep2);
    });
  });
});
