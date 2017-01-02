/* global angular */

angular.module('finances.dashboard', ['ngRoute'])

  .config(['$routeProvider', '$localStorageProvider', function ($routeProvider, $localStorageProvider) {
    $localStorageProvider.setKeyPrefix('')
    $routeProvider.when('/', {
      templateUrl: 'templates/dashboard.html',
      controller: 'DashboardCtrl'
    })
  }])

  .controller('DashboardCtrl', ['$scope', '$localStorage', '$filter', 'dataService', function ($scope, $localStorage, $filter, dataService) {
    const totalAmount = $filter('totalAmount')
    const daysInMonth = $filter('daysInMonth')
    const uuid = $filter('uuid')
    const now = new Date()

    $scope.$storage = $localStorage
    $scope.$storage.expenses = $scope.$storage.expenses || []
    $scope.$storage.income = $scope.$storage.income || []
    $scope.$storage.categories = $scope.$storage.categories || []

    $scope.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    $scope.months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    $scope.years = [2016, 2017, 2018]
    $scope.selectedMonth = now.getMonth()
    $scope.selectedYear = now.getFullYear()

    $scope.updateView = function (el) {
      const elDate = new Date(el.date)
      return elDate.getMonth() === $scope.selectedMonth && elDate.getFullYear() === $scope.selectedYear
    }

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

    if (!$scope.$storage.categories.length) {
      dataService.fetchData('categories')
        .then(response => {
          $scope.$storage.categories = response
        })
        .catch(error => console.error(error))
    }

    $scope.$watch('$storage', () => {
      updateData()
    }, true)

    $scope.addExpense = function () {
      const newExpense = {
        id: uuid(),
        type: $scope.expense.isRecurring ? 'fixed' : 'variable',
        date: new Date($scope.expense.date).getTime(),
        description: $scope.expense.description,
        amount: $scope.expense.amount,
        category: $scope.expense.category ? parseInt($scope.expense.category) : 0
      }

      $scope.$storage.expenses.push(newExpense)
    }

    $scope.addIncome = function () {
      const newIncome = {
        id: uuid(),
        date: new Date($scope.income.date).getTime(),
        description: $scope.income.description,
        amount: $scope.income.amount
      }

      $scope.$storage.income.push(newIncome)
    }

    $scope.deleteExpense = (expense) => {
      $scope.$storage.expenses.splice($scope.$storage.expenses.indexOf(expense), 1)
    }

    $scope.deleteIncome = (income) => {
      $scope.$storage.income.splice($scope.$storage.income.indexOf(income), 1)
    }

    function updateData () {
      const amountLeft = ((totalAmount($scope.$storage.income) - totalAmount($scope.$storage.expenses)) / daysInMonth(now.getMonth() + 1, now.getYear()))
      $scope.amountLeft = amountLeft > 0 ? amountLeft : 0

      $scope.expense = {}
      $scope.expense.date = now

      $scope.income = {}
      $scope.income.date = now

      $scope.$storage.expenses.map(expense => {
        const category = $scope.$storage.categories.find(category => category.id === expense.category)
        if (category) {
          expense.categoryName = category.name
          return expense
        }
      })
    }
  }])
