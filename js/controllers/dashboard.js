/* global _, angular */

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

    $scope.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    $scope.months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    $scope.selectedMonth = now.getMonth()
    $scope.selectedYear = now.getFullYear()

    $scope.updateView = (el) => {
      const elDate = new Date(el.date)
      return elDate.getMonth() === $scope.selectedMonth && elDate.getFullYear() === $scope.selectedYear
    }

    $scope.addExpense = () => {
      const newExpense = {
        id: uuid(),
        type: $scope.expense.isRecurring ? 'fixed' : 'variable',
        date: new Date($scope.expense.date).getTime(),
        description: $scope.expense.description,
        amount: $scope.expense.amount,
        category: $scope.expense.category ? parseInt($scope.expense.category) : 0
      }

      $localStorage.appData.expenses.push(newExpense)
    }

    $scope.addIncome = () => {
      const newIncome = {
        id: uuid(),
        date: new Date($scope.income.date).getTime(),
        description: $scope.income.description,
        amount: $scope.income.amount
      }

      $localStorage.appData.income.push(newIncome)
    }

    $scope.deleteExpense = (expense) => {
      $localStorage.appData.expenses.splice($localStorage.appData.expenses.indexOf(expense), 1)
    }

    $scope.deleteIncome = (income) => {
      $localStorage.appData.income.splice($localStorage.appData.income.indexOf(income), 1)
    }

    function updateData () {
      if (typeof $localStorage.appData === 'undefined') return

      const amountLeft = ((totalAmount($localStorage.appData.income) - totalAmount($localStorage.appData.expenses)) / daysInMonth(now.getMonth() + 1, now.getYear()))
      $scope.amountLeft = amountLeft > 0 ? amountLeft : 0

      $scope.selectedCurrency = $localStorage.appData.settings.currency

      $scope.years = _.chain($localStorage.appData.expenses)
        .union($localStorage.appData.income)
        .groupBy(expense => new Date(expense.date).getFullYear())
        .keys()
        .map(year => parseInt(year))
        .value()

      $scope.expense = {}
      $scope.expense.date = now

      $scope.income = {}
      $scope.income.date = now

      $localStorage.appData.expenses.map(expense => {
        const category = $localStorage.appData.categories.find(category => category.id === expense.category)
        if (category) {
          expense.categoryName = category.name
          return expense
        }
      })
    }
  }])
