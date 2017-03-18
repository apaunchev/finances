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

    $scope.exportData = function (target) {
      const link = target
      const appDataJson = angular.toJson($localStorage.appData)
      const blob = new window.Blob([appDataJson], { type: 'application/json' })
      link.href = window.URL.createObjectURL(blob)
      link.download = `finances_${new Date().getTime()}.json`
    }

    $scope.importData = function (event) {
      const reader = new window.FileReader()
      const files = event.target.files

      if (!files.length) {
        return
      }

      reader.readAsText(files[0])
      reader.onload = () => {
        $localStorage.appData = JSON.parse(reader.result)
        $location.path('/')
        $scope.$apply()
      }
    }

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

    $scope.openImportDialog = () => {
      document.querySelector('#importDialog').click()
    }

    function updateData () {
      if (typeof $localStorage.appData === 'undefined') return

      $scope.selectedCurrency = $localStorage.appData.settings.currency
    }
  }])
