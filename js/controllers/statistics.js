/* global angular */

angular.module('finances.statistics', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/statistics', {
      templateUrl: 'templates/statistics.html',
      controller: 'StatisticsCtrl'
    })
  }])

  .controller('StatisticsCtrl', ['$scope', '$localStorage', '$filter', 'dataService', function ($scope, $localStorage, $filter, dataService) {
    const totalAmount = $filter('totalAmount')
    const findHighest = $filter('findHighest')
    const getWeekNumber = $filter('getWeekNumber')

    $scope.$storage = $localStorage
    $scope.$storage.expenses = $scope.$storage.expenses || []
    $scope.$storage.income = $scope.$storage.income || []
    $scope.$storage.settings = $scope.$storage.settings || {}

    if (!$scope.$storage.expenses.length) {
      dataService.fetchData('expenses')
        .then(response => {
          $scope.$storage.expenses = response
        })
        .catch(error => console.error(error))
    }

    if (!$scope.$storage.income.length) {
      dataService.fetchData('income')
        .then(response => {
          $scope.$storage.income = response
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

    const now = new Date()
    const month = now.getMonth()
    const week = getWeekNumber(now)
    const year = now.getFullYear()

    $scope.balance = totalAmount($scope.$storage.income) - totalAmount($scope.$storage.expenses)

    const weeklyIncome = $scope.$storage.income.filter(income => getWeekNumber(new Date(income.date)) === week)
    $scope.weeklyIncome = totalAmount(weeklyIncome)
    $scope.weeklyHighestIncome = findHighest(weeklyIncome)

    const weeklyExpenses = $scope.$storage.expenses.filter(expense => getWeekNumber(new Date(expense.date)) === week)
    $scope.weeklyExpenses = totalAmount(weeklyExpenses)
    $scope.weeklyHighestExpense = findHighest(weeklyExpenses)

    const monthlyIncome = $scope.$storage.income.filter(income => new Date(income.date).getMonth() === month)
    $scope.monthlyIncome = totalAmount(monthlyIncome)
    $scope.monthlyHighestIncome = findHighest(monthlyIncome)

    const monthlyExpenses = $scope.$storage.expenses.filter(expense => new Date(expense.date).getMonth() === month)
    $scope.monthlyExpenses = totalAmount(monthlyExpenses)
    $scope.monthlyHighestExpense = findHighest(monthlyExpenses)

    const yearlyIncome = $scope.$storage.income.filter(income => new Date(income.date).getFullYear() === year)
    $scope.yearlyIncome = totalAmount(yearlyIncome)
    $scope.yearlyHighestIncome = findHighest(yearlyIncome)

    const yearlyExpenses = $scope.$storage.expenses.filter(expense => new Date(expense.date).getFullYear() === year)
    $scope.yearlyExpenses = totalAmount(yearlyExpenses)
    $scope.yearlyHighestExpense = findHighest(yearlyExpenses)
  }])
