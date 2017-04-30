/* global angular */

(function () {
  'use strict'

  angular
    .module('finances.nav', ['ngRoute'])
    .controller('NavCtrl', ['$scope', '$location', '$window', 'authService', NavCtrl])

  function NavCtrl ($scope, $location, $window, authService) {
    $scope.auth = authService
    $scope.user = null

    $scope.isActive = (path) => {
      return $location.path().substr(0, path.length) === path
    }

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

    $scope.signOut = () => {
      $scope.auth.signOut()
      $window.location.reload()
    }
  }
})()
