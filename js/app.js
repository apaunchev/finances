/* global angular */

angular.module('finances', [
  'ngRoute',
  'ngStorage',
  'finances.services',
  'finances.dashboard',
  'finances.statistics',
  'finances.categories',
  'finances.settings',
  'finances.filters'
])

  .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $routeProvider.otherwise({ redirectTo: '/' })
  }])
