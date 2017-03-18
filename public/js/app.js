/* global angular, firebase */

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
    var config = {
      apiKey: 'AIzaSyDO5aGZX4nztCKYpqFY2PgE-XpJrJB9fwg',
      authDomain: 'finances-app-1191e.firebaseapp.com',
      databaseURL: 'https://finances-app-1191e.firebaseio.com',
      storageBucket: 'finances-app-1191e.appspot.com',
      messagingSenderId: '1006685798394'
    }
    firebase.initializeApp(config)
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
