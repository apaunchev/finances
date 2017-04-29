/* global angular, firebase */

(function () {
  'use strict'

  angular
    .module('finances', [
      'ngRoute',
      'finances.auth',
      'finances.services',
      'finances.nav',
      'finances.dashboard',
      'finances.statistics',
      'finances.settings',
      'finances.filters'
    ])
    .config(configFunction)
    .run(runFunction)

  window.openFirebaseConnections = []

  configFunction.$inject = ['$provide', '$routeProvider']

  function configFunction ($provide, $routeProvider) {
    $routeProvider.otherwise({ redirectTo: '/' })

    firebase.initializeApp({
      apiKey: 'AIzaSyDO5aGZX4nztCKYpqFY2PgE-XpJrJB9fwg',
      authDomain: 'finances-app-1191e.firebaseapp.com',
      databaseURL: 'https://finances-app-1191e.firebaseio.com',
      storageBucket: 'finances-app-1191e.appspot.com',
      messagingSenderId: '1006685798394'
    })

    firebaseDecorator.$inject = ['$delegate']

    $provide.decorator('$firebaseArray', firebaseDecorator)
    $provide.decorator('$firebaseObject', firebaseDecorator)

    function firebaseDecorator ($delegate) {
      return function (ref) {
        const list = $delegate(ref)
        window.openFirebaseConnections.push(list)
        return list
      }
    }
  }

  runFunction.$inject = ['$rootScope', '$location']

  function runFunction ($rootScope, $location) {
    $rootScope.$on('$routeChangeError', (event, next, previous, error) => {
      if (error === 'AUTH_REQUIRED') {
        $location.path('/')
      }
    })
  }
})()
