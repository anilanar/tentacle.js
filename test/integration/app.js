(function () {
  'use strict';
  var app = angular.module('tentacleApp', []);

  app.factory('serviceDep1', [function () {
    return {
      name: 'serviceDep1'
    };
  }]);
  app.factory('serviceDep2', [function () {
    return {
      name: 'serviceDep2'
    };
  }]);
  app.factory('qTest', [function () {
    return {
      name: 'qTest'
    };
  }]);

  app.factory('tentacleService', [
    'serviceDep1',
    'serviceDep2',
    tentacleService
  ]);

  function tentacleService(
    serviceDep1,
    serviceDep2
  ) {
    return {
      serviceDep1: serviceDep1,
      serviceDep2: serviceDep2
    };
  }

  app.controller('tentacleCtrl', [
    '$scope',
    '$q',
    'qTest',
    'serviceDep1',
    'serviceDep2',
    tentacleCtrl
  ]);

  function tentacleCtrl(
    $scope,
    $q,
    qTest,
    serviceDep1,
    serviceDep2
  ) {
    this.serviceDep1 = serviceDep1;
    this.serviceDep2 = serviceDep2;
    qTest.test = null;
    $q.when().then(function () {
      qTest.test = true;
    });
  }

  app.directive('tentacleDir', [
    '$q',
    'qTest',
    'serviceDep1',
    'serviceDep2',
    tentacleDir
  ]);

  function tentacleDir(
    $q,
    qTest,
    serviceDep1,
    serviceDep2
  ) {
    function link(scope) {
      $q.when().then(function () {
        qTest.test = true;
      });

      scope.serviceDep1 = serviceDep1;
      scope.serviceDep2 = serviceDep2;

    }
    function ctrl() {}
    return {
      restrict: 'EA',
      link: link,
      controller: ['$scope', ctrl],
      template: '<h1>tentacle.js</h1>'
    };
  }
})();
