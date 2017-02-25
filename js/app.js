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

  .config(['$locationProvider', '$routeProvider', '$compileProvider', function ($locationProvider, $routeProvider, $compileProvider) {
    $routeProvider.otherwise({ redirectTo: '/' })
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/)
  }])

  .directive('customOnChange', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        const onChangeHandler = scope.$eval(attrs.customOnChange)
        element.bind('change', onChangeHandler)
      }
    }
  })
