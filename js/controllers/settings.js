/* global angular */

angular.module('finances.settings', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/settings', {
      templateUrl: 'templates/settings.html',
      controller: 'SettingsCtrl'
    })
  }])

  .controller('SettingsCtrl', ['$scope', '$location', '$localStorage', function ($scope, $location, $localStorage) {
    $scope.resetData = () => {
      $localStorage.$reset()
      $location.path('/')
    }
  }])
