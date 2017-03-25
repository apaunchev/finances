/* global angular */

function SettingsCtrlConfig ($routeProvider) {
  $routeProvider.when('/settings', {
    templateUrl: 'templates/settings.html',
    controller: 'SettingsCtrl'
  })
}

function SettingsCtrl ($scope, $location, firebaseDataService) {
  $scope.categories = firebaseDataService.categories
  $scope.settings = firebaseDataService.currentUserSettings
  $scope.hideForm = true
  $scope.loading = true

  $scope.settings.$loaded()
    .then(settings => {
      $scope.categories.$loaded()
        .then(categories => {
          $scope.loading = false
          updateData()
        })
    })
    .catch(error => console.error(error))

  $scope.addCategory = () => {
    $scope.categories.$add({
      name: $scope.category.name,
      colour: $scope.category.colour
    })
    $scope.category = {}
  }

  $scope.deleteCategory = (category) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      $scope.categories.$remove(category)
    }
  }

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
