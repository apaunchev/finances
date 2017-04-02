/* global angular */

(function () {
  'use strict'

  angular
    .module('finances.auth', [])
    .factory('authService', authService)

  authService.$inject = ['$firebaseAuth', '$location', '$window']

  function authService ($firebaseAuth, $location, $window) {
    const firebaseAuthObject = $firebaseAuth()

    const service = {
      onAuthStateChanged: (firebaseUser) => firebaseAuthObject.$onAuthStateChanged(firebaseUser),
      requireSignIn: () => firebaseAuthObject.$requireSignIn(),
      isSignedIn: () => firebaseAuthObject.$getAuth(),
      signIn: () => firebaseAuthObject.$signInWithPopup('google'),
      signOut
    }

    function signOut () {
      angular.forEach($window.openFirebaseConnections, function (item) {
        item.$destroy()
      })

      $location.path('/')

      firebaseAuthObject.$signOut()
    }

    return service
  }
})()
