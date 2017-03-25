/* global angular */

function StatisticsCtrlConfig ($routeProvider) {
  $routeProvider.when('/statistics', {
    templateUrl: 'templates/statistics.html',
    controller: 'StatisticsCtrl'
  })
}

function StatisticsCtrl ($scope, $filter, firebaseDataService) {
  const { currentUserTransactions, currentUserSettings } = firebaseDataService
  const totalAmount = $filter('totalAmount')
  const findHighest = $filter('findHighest')
  const getWeekNumber = $filter('getWeekNumber')
  const now = new Date()
  const month = now.getMonth()
  const week = getWeekNumber(now)
  const year = now.getFullYear()

  $scope.transactions = currentUserTransactions
  $scope.settings = currentUserSettings
  $scope.loading = true

  $scope.transactions.$loaded()
    .then(transactions => {
      $scope.loading = false
      updateData(transactions)
    })
    .catch(error => console.error(error))

  function updateData (transactions) {
    const incomes = transactions.filter(transaction => transaction.amount > 0)
    const expenses = transactions.filter(transaction => transaction.amount < 0)

    const weeklyIncome = incomes.filter(income => getWeekNumber(new Date(income.date)) === week)
    $scope.weeklyIncome = totalAmount(weeklyIncome)
    $scope.weeklyHighestIncome = findHighest(weeklyIncome, 'max')

    const weeklyExpenses = expenses.filter(expense => getWeekNumber(new Date(expense.date)) === week)
    $scope.weeklyExpenses = totalAmount(weeklyExpenses)
    $scope.weeklyHighestExpense = findHighest(weeklyExpenses, 'min')

    const monthlyIncome = incomes.filter(income => new Date(income.date).getMonth() === month)
    $scope.monthlyIncome = totalAmount(monthlyIncome)
    $scope.monthlyHighestIncome = findHighest(monthlyIncome, 'max')

    const monthlyExpenses = expenses.filter(expense => new Date(expense.date).getMonth() === month)
    $scope.monthlyExpenses = totalAmount(monthlyExpenses)
    $scope.monthlyHighestExpense = findHighest(monthlyExpenses, 'min')

    const yearlyIncome = incomes.filter(income => new Date(income.date).getFullYear() === year)
    $scope.yearlyIncome = totalAmount(yearlyIncome)
    $scope.yearlyHighestIncome = findHighest(yearlyIncome, 'max')

    const yearlyExpenses = expenses.filter(expense => new Date(expense.date).getFullYear() === year)
    $scope.yearlyExpenses = totalAmount(yearlyExpenses)
    $scope.yearlyHighestExpense = findHighest(yearlyExpenses, 'min')
  }
}

angular.module('finances.statistics', ['ngRoute'])
  .config(['$routeProvider', StatisticsCtrlConfig])
  .controller('StatisticsCtrl', ['$scope', '$filter', 'firebaseDataService', StatisticsCtrl])
