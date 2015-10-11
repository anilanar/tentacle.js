var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');

module.exports = function (globalScope, moduleName) {
  return {
    injectAllTest: function (name) {
      globalScope.tentacle.injectAll(moduleName, name);
      expect(globalScope.dep0.__name).to.equal('dep0');
      expect(globalScope.dep1.__name).to.equal('dep1');
    },
    injectGlobalTest: function (name) {
      globalScope.tentacle.injectAll(moduleName, name);
      _.forEach(globalScope.tentacle.globalInjects, function (i) {
        expect(globalScope[i].__name).to.equal(i);
      });
    }
  };
};
