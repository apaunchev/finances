/* global angular */

angular.module('finances.settings', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/settings', {
      templateUrl: 'templates/settings.html',
      controller: 'SettingsCtrl'
    })
  }])

  .controller('SettingsCtrl', ['$scope', '$location', '$localStorage', 'dataService', function ($scope, $location, $localStorage, dataService) {
    $scope.$storage = $localStorage
    $scope.$storage.settings = $scope.$storage.settings || {}

    if (angular.equals($scope.$storage.settings, {})) {
      dataService.fetchData('settings')
        .then(response => {
          $scope.$storage.settings = response
          $scope.selectedCurrency = $scope.$storage.settings.currency
        })
        .catch(error => console.error(error))
    }

    $scope.$watch('$storage', () => {
      updateData()
    }, true)

    $scope.updateCurrency = function () {
      $scope.$storage.settings.currency = $scope.selectedCurrency
    }

    $scope.currencies = [
      'EUR', 'AUD', 'BGN', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'GBP', 'GEL', 'HKD', 'HUF', 'INR', 'MYR',
      'MXN', 'NOK', 'NZD', 'PLN', 'RON', 'SEK', 'SGD', 'THB', 'NGN', 'PKR', 'TRY', 'USD',
      'ZAR', 'JPY', 'PHP', 'MAD', 'COP', 'AED', 'IDR', 'CLP', 'UAH', 'RUB', 'KRW', 'LKR'
    ]

    $scope.resetData = () => {
      $localStorage.$reset()
      $location.path('/')
    }

    function updateData () {
      $scope.selectedCurrency = $scope.$storage.settings.currency
    }
  }])
