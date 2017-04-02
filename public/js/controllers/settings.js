/* global angular */

function SettingsCtrlConfig ($routeProvider) {
  $routeProvider.when('/settings', {
    templateUrl: 'templates/settings.html',
    controller: 'SettingsCtrl',
    resolve: {
      'currentAuth': ['authService', function (authService) {
        return authService.requireSignIn()
      }]
    }
  })
}

function SettingsCtrl ($scope, $q, $location, firebaseDataService) {
  const { categories, settings } = firebaseDataService
  $scope.categories = categories
  $scope.settings = settings

  $scope.hideForm = true
  $scope.loading = true

  $q.all([
    $scope.settings.$loaded(),
    $scope.categories.$loaded()
  ])
    .then(() => {
      $scope.currency = $scope.settings.currency
      $scope.loading = false
    })
    .catch(err => console.error(err))

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
    $scope.settings.currency = $scope.currency
    $scope.settings.$save()
  }
}

angular.module('finances.settings', ['ngRoute'])
  .config(['$routeProvider', SettingsCtrlConfig])
  .controller('SettingsCtrl', ['$scope', '$q', '$location', 'firebaseDataService', SettingsCtrl])
