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

    if (typeof $localStorage.appData === 'undefined') {
      dataService.fetchData()
        .then(response => {
          $localStorage.appData = response
        })
        .catch(error => console.error(error))
    }

    $scope.$watch('$storage', () => {
      updateData()
    }, true)

    $scope.updateCurrency = function () {
      $localStorage.appData.settings.currency = $scope.selectedCurrency
    }

    $scope.currencies = [
      'EUR', 'AUD', 'BGN', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'GBP', 'GEL', 'HKD', 'HUF',
      'INR', 'MYR', 'MXN', 'NOK', 'NZD', 'PLN', 'RON', 'SEK', 'SGD', 'THB', 'NGN', 'PKR', 'TRY',
      'USD', 'ZAR', 'JPY', 'PHP', 'MAD', 'COP', 'AED', 'IDR', 'CLP', 'UAH', 'RUB', 'KRW', 'LKR'
    ]

    $scope.resetData = () => {
      delete $localStorage.appData
      $location.path('/')
    }

    function updateData () {
      if (typeof $localStorage.appData === 'undefined') return

      $scope.selectedCurrency = $localStorage.appData.settings.currency
    }
  }])
