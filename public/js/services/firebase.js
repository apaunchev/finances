/* global angular, firebase */

function firebaseDataService ($firebaseObject, $firebaseArray, authService) {
  const root = firebase.database().ref()
  const currentUser = authService.isSignedIn()

  return {
    categories: $firebaseArray(root.child('categories').child(currentUser.uid)),
    settings: $firebaseObject(root.child('settings').child(currentUser.uid)),
    transactions: $firebaseArray(root.child('transactions').child(currentUser.uid))
  }
}

angular.module('finances.services', ['firebase'])
  .factory('firebaseDataService', ['$firebaseObject', '$firebaseArray', 'authService', firebaseDataService])
