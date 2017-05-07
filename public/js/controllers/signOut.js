/* global angular */

(function () {
  'use strict'

  angular
    .module('finances.signOut', [])
    .config(signOutConfig)
    .controller('SignOutCtrl', SignOutCtrl)

  signOutConfig.$inject = ['$routeProvider']
  function signOutConfig ($routeProvider) {
    $routeProvider.when('/signOut', {
      template: '',
      controller: 'SignOutCtrl'
    })
  }

  SignOutCtrl.inject = ['$window', 'authService']
  function SignOutCtrl ($window, authService) {
    signOut()

    function signOut () {
      authService.signOut()
      $window.location.reload()
    }
  }
})()
