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

    $scope.addCategory = () => {
      $localStorage.appData.categories.push({
        id: uuid(),
        name: $scope.category.name
      })

      $scope.category = {}
    }

    $scope.deleteCategory = (category) => {
      $localStorage.appData.categories.splice($localStorage.appData.categories.indexOf(category), 1)
    }

    function updateData () {
      $localStorage.appData.categories.map(category => {
        category.spent = $localStorage.appData.expenses
          .filter(expense => expense.category === category.id)
          .reduce((a, b) => {
            return a + b.amount
          }, 0)

        return category
      })
    }
  }])
