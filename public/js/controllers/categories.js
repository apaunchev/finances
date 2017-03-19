/* global angular */

function CategoriesCtrlConfig ($routeProvider) {
  $routeProvider.when('/categories', {
    templateUrl: 'templates/categories.html',
    controller: 'CategoriesCtrl'
  })
}

function CategoriesCtrl ($scope, firebaseDataService) {
  $scope.categories = firebaseDataService.categories

  $scope.addCategory = () => {
    $scope.categories.$add({
      name: $scope.category.name,
      colour: $scope.category.colour
    })
    $scope.category = {}
  }

  $scope.deleteCategory = (category) => {
    $scope.categories.$remove(category)
  }
}

angular.module('finances.categories', ['ngRoute'])
  .config(['$routeProvider', CategoriesCtrlConfig])
  .controller('CategoriesCtrl', ['$scope', 'firebaseDataService', CategoriesCtrl])
