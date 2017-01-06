/* global angular */

angular.module('finances.categories', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/categories', {
      templateUrl: 'templates/categories.html',
      controller: 'CategoriesCtrl'
    })
  }])

  .controller('CategoriesCtrl', ['$scope', '$localStorage', '$filter', 'dataService', function ($scope, $localStorage, $filter, dataService) {
    const uuid = $filter('uuid')

    $scope.$storage = $localStorage
    $scope.$storage.categories = $scope.$storage.categories || []
    $scope.$storage.expenses = $scope.$storage.expenses || []
    $scope.$storage.settings = $scope.$storage.settings || {}

    if (!$scope.$storage.categories.length) {
      dataService.fetchData('categories')
        .then(response => {
          $scope.$storage.categories = response
        })
        .catch(error => console.error(error))
    }

    if (!$scope.$storage.expenses.length) {
      dataService.fetchData('expenses')
        .then(response => {
          $scope.$storage.expenses = response
        })
        .catch(error => console.error(error))
    }

    if (angular.equals($scope.$storage.settings, {})) {
      dataService.fetchData('settings')
        .then(response => {
          $scope.$storage.settings = response
        })
        .catch(error => console.error(error))
    }

    $scope.$watch('$storage', () => {
      updateData()
    }, true)

    function updateData () {
      $scope.$storage.categories.map(category => {
        category.spent = $scope.$storage.expenses
          .filter(expense => expense.category === category.id)
          .reduce((a, b) => {
            return a + b.amount
          }, 0)

        return category
      })
    }

    $scope.addCategory = () => {
      $scope.$storage.categories.push({
        id: uuid(),
        name: $scope.category.name
      })

      $scope.category = {}
    }

    $scope.deleteCategory = (category) => {
      $scope.$storage.categories.splice($scope.$storage.categories.indexOf(category), 1)
    }
  }])
