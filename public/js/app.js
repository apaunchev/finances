/* global angular, firebase */

function AppConfig ($locationProvider, $routeProvider, $compileProvider) {
  $routeProvider.otherwise({ redirectTo: '/' })
  firebase.initializeApp({
    apiKey: 'AIzaSyDO5aGZX4nztCKYpqFY2PgE-XpJrJB9fwg',
    authDomain: 'finances-app-1191e.firebaseapp.com',
    databaseURL: 'https://finances-app-1191e.firebaseio.com',
    storageBucket: 'finances-app-1191e.appspot.com',
    messagingSenderId: '1006685798394'
  })
}

angular.module('finances', [
  'ngRoute',
  'finances.services',
  'finances.dashboard',
  'finances.statistics',
  'finances.categories',
  'finances.settings',
  'finances.filters'
])
  .config(['$locationProvider', '$routeProvider', '$compileProvider', AppConfig])
