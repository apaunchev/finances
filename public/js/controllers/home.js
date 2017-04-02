/* global angular */

function HomeCtrlConfig ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  })
}

function HomeCtrl ($rootScope, $scope, $location, $window, authService) {
  $scope.auth = authService

  $scope.auth.onAuthStateChanged(firebaseUser => {
    $scope.user = firebaseUser
  })

  $scope.signIn = function () {
    $scope.auth.signIn()
      .then(res => {
        $location.path('/dashboard')
      })
      .catch(err => console.error(err))
  }

  $scope.signOut = function () {
    $scope.auth.signOut()
    $window.location.reload()
  }
}

angular.module('finances.home', ['ngRoute'])
  .config(['$routeProvider', HomeCtrlConfig])
  .controller('HomeCtrl', ['$rootScope', '$scope', '$location', '$window', 'authService', HomeCtrl])
