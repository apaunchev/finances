/* global angular, firebase */

function firebaseDataService ($firebaseObject, $firebaseArray) {
  const root = firebase.database().ref()

  return {
    users: $firebaseArray(root.child('users')),
    categories: $firebaseArray(root.child('categories')),
    currentUser: $firebaseObject(root.child('users').child('-KfXA4Zez0CyzWEd4UFz')),
    currentUserTransactions: $firebaseArray(root.child('users').child('-KfXA4Zez0CyzWEd4UFz').child('transactions')),
    currentUserSettings: $firebaseObject(root.child('users').child('-KfXA4Zez0CyzWEd4UFz').child('settings'))
  }
}

angular.module('finances.services', ['firebase'])
  .factory('firebaseDataService', ['$firebaseObject', '$firebaseArray', firebaseDataService])
