/* global angular */

function NavCtrl ($scope, $location, $window, authService) {
  $scope.auth = authService
  $scope.user = null

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

angular.module('finances.nav', ['ngRoute'])
  .controller('NavCtrl', ['$scope', '$location', '$window', 'authService', NavCtrl])
