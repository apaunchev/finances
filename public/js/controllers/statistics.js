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

    if (typeof $localStorage.appData === 'undefined') {
      dataService.fetchData()
        .then(response => {
          $localStorage.appData = response
        })
        .catch(error => console.error(error))
    }

    const now = new Date()
    const month = now.getMonth()
    const week = getWeekNumber(now)
    const year = now.getFullYear()

    $scope.balance = totalAmount($localStorage.appData.incomes) - totalAmount($localStorage.appData.expenses)

    const weeklyIncome = $localStorage.appData.incomes.filter(income => getWeekNumber(new Date(income.date)) === week)
    $scope.weeklyIncome = totalAmount(weeklyIncome)
    $scope.weeklyHighestIncome = findHighest(weeklyIncome)

    const weeklyExpenses = $localStorage.appData.expenses.filter(expense => getWeekNumber(new Date(expense.date)) === week)
    $scope.weeklyExpenses = totalAmount(weeklyExpenses)
    $scope.weeklyHighestExpense = findHighest(weeklyExpenses)

    const monthlyIncome = $localStorage.appData.incomes.filter(income => new Date(income.date).getMonth() === month)
    $scope.monthlyIncome = totalAmount(monthlyIncome)
    $scope.monthlyHighestIncome = findHighest(monthlyIncome)

    const monthlyExpenses = $localStorage.appData.expenses.filter(expense => new Date(expense.date).getMonth() === month)
    $scope.monthlyExpenses = totalAmount(monthlyExpenses)
    $scope.monthlyHighestExpense = findHighest(monthlyExpenses)

    const yearlyIncome = $localStorage.appData.incomes.filter(income => new Date(income.date).getFullYear() === year)
    $scope.yearlyIncome = totalAmount(yearlyIncome)
    $scope.yearlyHighestIncome = findHighest(yearlyIncome)

    const yearlyExpenses = $localStorage.appData.expenses.filter(expense => new Date(expense.date).getFullYear() === year)
    $scope.yearlyExpenses = totalAmount(yearlyExpenses)
    $scope.yearlyHighestExpense = findHighest(yearlyExpenses)
  }])
