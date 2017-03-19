/* global angular */

function SettingsCtrlConfig ($routeProvider) {
  $routeProvider.when('/settings', {
    templateUrl: 'templates/settings.html',
    controller: 'SettingsCtrl'
  })
}

function SettingsCtrl ($scope, $location, firebaseDataService) {
  $scope.settings = firebaseDataService.currentUserSettings

  $scope.settings.$loaded()
    .then(settings => updateData())
    .catch(error => console.error(error))

  $scope.currencies = [
    'EUR', 'AUD', 'BGN', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'GBP', 'GEL', 'HKD', 'HUF',
    'INR', 'MYR', 'MXN', 'NOK', 'NZD', 'PLN', 'RON', 'SEK', 'SGD', 'THB', 'NGN', 'PKR', 'TRY',
    'USD', 'ZAR', 'JPY', 'PHP', 'MAD', 'COP', 'AED', 'IDR', 'CLP', 'UAH', 'RUB', 'KRW', 'LKR'
  ]

  $scope.setCurrency = () => {
    $scope.settings.currency = $scope.selectedCurrency
    $scope.settings.$save()
  }

  function updateData () {
    $scope.selectedCurrency = $scope.settings.currency
  }
}

angular.module('finances.settings', ['ngRoute'])
  .config(['$routeProvider', SettingsCtrlConfig])
  .controller('SettingsCtrl', ['$scope', '$location', 'firebaseDataService', SettingsCtrl])
