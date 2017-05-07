/* global angular, _ */

(function () {
  'use strict'

  angular.module('finances.statistics', [])
    .config(StatisticsConfig)
    .controller('StatisticsCtrl', StatisticsCtrl)

  StatisticsConfig.$inject = ['$routeProvider']
  function StatisticsConfig ($routeProvider) {
    $routeProvider.when('/statistics', {
      templateUrl: 'templates/statistics.html',
      controller: 'StatisticsCtrl',
      resolve: {
        'currentAuth': ['authService', function (authService) {
          return authService.requireSignIn()
        }]
      }
    })
  }

  StatisticsCtrl.$inject = ['$scope', '$filter', '$q', 'firebaseDataService']
  function StatisticsCtrl ($scope, $filter, $q, firebaseDataService) {
    const vm = this
    const { transactions, settings } = firebaseDataService
    const totalAmount = $filter('totalAmount')
    vm.loading = true

    $q.all([
      transactions.$loaded(),
      settings.$loaded()
    ])
      .then(data => loadData())
      .catch(err => console.error(err))

    function loadData () {
      const income = transactions.filter(transaction => transaction.amount > 0)
      const expenses = transactions.filter(transaction => transaction.amount < 0)
      vm.currency = settings.currency
      vm.income = createTransactionsObject(income)
      vm.expenses = createTransactionsObject(expenses)
      vm.loading = false
    }

    function createTransactionsObject (transactions) {
      return _.chain(transactions)
        .groupBy(transaction => new Date(transaction.date).getFullYear())
        .mapObject(year => {
          return _.chain(year)
              .groupBy(transaction => new Date(transaction.date).getMonth())
              .mapObject(month => totalAmount(month))
              .value()
        })
        .value()
    }

    // $scope.transactions = transactions
    // $scope.settings = settings
    // $scope.loading = true

    // $q.all([
    //   $scope.transactions.$loaded(),
    //   $scope.settings.$loaded()
    // ])
    //   .then(() => {
    //     $scope.currency = $scope.settings.currency
    //     $scope.loading = false
    //     updateData($scope.transactions)
    //   })
    //   .catch(err => console.error(err))

    // function updateData (transactions) {
    //   const incomes = transactions.filter(transaction => transaction.amount > 0)
    //   const expenses = transactions.filter(transaction => transaction.amount < 0)

    //   const weeklyIncome = incomes.filter(income => getWeekNumber(new Date(income.date)) === week)
    //   $scope.weeklyIncome = totalAmount(weeklyIncome)
    //   $scope.weeklyHighestIncome = findHighest(weeklyIncome, 'max')

    //   const weeklyExpenses = expenses.filter(expense => getWeekNumber(new Date(expense.date)) === week)
    //   $scope.weeklyExpenses = totalAmount(weeklyExpenses)
    //   $scope.weeklyHighestExpense = findHighest(weeklyExpenses, 'min')

    //   const monthlyIncome = incomes.filter(income => new Date(income.date).getMonth() === month)
    //   $scope.monthlyIncome = totalAmount(monthlyIncome)
    //   $scope.monthlyHighestIncome = findHighest(monthlyIncome, 'max')

    //   const monthlyExpenses = expenses.filter(expense => new Date(expense.date).getMonth() === month)
    //   $scope.monthlyExpenses = totalAmount(monthlyExpenses)
    //   $scope.monthlyHighestExpense = findHighest(monthlyExpenses, 'min')

    //   const yearlyIncome = incomes.filter(income => new Date(income.date).getFullYear() === year)
    //   $scope.yearlyIncome = totalAmount(yearlyIncome)
    //   $scope.yearlyHighestIncome = findHighest(yearlyIncome, 'max')

    //   const yearlyExpenses = expenses.filter(expense => new Date(expense.date).getFullYear() === year)
    //   $scope.yearlyExpenses = totalAmount(yearlyExpenses)
    //   $scope.yearlyHighestExpense = findHighest(yearlyExpenses, 'min')
    // }
  }
})()
