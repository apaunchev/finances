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
    const getWeekNumber = $filter('getWeekNumber')

    $scope.$storage = $localStorage
    $scope.$storage.expenses = $scope.$storage.expenses || []
    $scope.$storage.income = $scope.$storage.income || []

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

    const now = new Date()
    const month = now.getMonth() + 1
    const week = getWeekNumber(now)
    const year = now.getFullYear()

    $scope.balance = totalAmount($scope.$storage.income) - totalAmount($scope.$storage.expenses)

    const weeklyIncome = $scope.$storage.income.filter(income => getWeekNumber(new Date(income.date)) === week)
    $scope.weeklyIncome = totalAmount(weeklyIncome)
    $scope.weeklyHighestIncome = $scope.weeklyIncome > 0 ? Math.max.apply(Math, weeklyIncome.map(income => income.amount)) : 0

    const weeklyExpenses = $scope.$storage.expenses.filter(expense => getWeekNumber(new Date(expense.date)) === week)
    $scope.weeklyExpenses = totalAmount(weeklyExpenses)
    $scope.weeklyHighestExpense = $scope.weeklyExpenses > 0 ? Math.max.apply(Math, weeklyExpenses.map(expense => expense.amount)) : 0

    const monthlyIncome = $scope.$storage.income.filter(income => new Date(income.date).getMonth() + 1 === month)
    $scope.monthlyIncome = totalAmount(monthlyIncome)
    $scope.monthlyHighestIncome = $scope.monthlyIncome > 0 ? Math.max.apply(Math, monthlyIncome.map(income => income.amount)) : 0

    const monthlyExpenses = $scope.$storage.expenses.filter(expense => new Date(expense.date).getMonth() + 1 === month)
    $scope.monthlyExpenses = totalAmount(monthlyExpenses)
    $scope.monthlyHighestExpense = $scope.monthlyExpenses > 0 ? Math.max.apply(Math, monthlyExpenses.map(expense => expense.amount)) : 0

    const yearlyIncome = $scope.$storage.income.filter(income => new Date(income.date).getFullYear() === year)
    $scope.yearlyIncome = totalAmount(yearlyIncome)
    $scope.yearlyHighestIncome = $scope.yearlyIncome > 0 ? Math.max.apply(Math, yearlyIncome.map(income => income.amount)) : 0

    const yearlyExpenses = $scope.$storage.expenses.filter(expense => new Date(expense.date).getFullYear() === year)
    $scope.yearlyExpenses = totalAmount(yearlyExpenses)
    $scope.yearlyHighestExpense = $scope.yearlyExpenses > 0 ? Math.max.apply(Math, yearlyExpenses.map(expense => expense.amount)) : 0
  }])
