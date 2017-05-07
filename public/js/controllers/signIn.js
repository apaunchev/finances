/* global angular */

(function () {
  'use strict'

  angular
    .module('finances.signIn', [])
    .config(signInConfig)
    .controller('SignInCtrl', SignInCtrl)

  signInConfig.$inject = ['$routeProvider']
  function signInConfig ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'templates/signIn.html',
      controller: 'SignInCtrl'
    })
  }

  SignInCtrl.$inject = ['$scope', '$location', 'authService']
  function SignInCtrl ($scope, $location, authService) {
    $scope.auth = authService
    $scope.user = null

    $scope.auth.onAuthStateChanged(firebaseUser => {
      $scope.user = firebaseUser
    })

    $scope.signIn = () => {
      $scope.auth.signIn()
        .then(res => {
          $location.path('/dashboard')
        })
        .catch(err => console.error(err))
    }
  }
})()
