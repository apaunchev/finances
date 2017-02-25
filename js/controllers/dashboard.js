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
    $scope.$watchGroup(['selectedYear', 'selectedMonth'], () => updateData())

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    $scope.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    $scope.months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    $scope.selectedMonth = now.getMonth()
    $scope.selectedYear = now.getFullYear()

    $scope.addExpense = () => {
      const newExpense = {
        id: uuid(),
        type: $scope.expense.isRecurring ? 'fixed' : 'variable',
        date: new Date($scope.expense.date).getTime(),
        description: $scope.expense.description ? $scope.expense.description : $scope.expense.category.name,
        amount: parseFloat($scope.expense.amount),
        category: $scope.expense.category ? $scope.expense.category.id : 0
      }

      $localStorage.appData.expenses.push(newExpense)
    }

    $scope.addIncome = () => {
      const newIncome = {
        id: uuid(),
        date: new Date($scope.income.date).getTime(),
        description: $scope.income.description,
        amount: parseFloat($scope.income.amount)
      }

      $localStorage.appData.incomes.push(newIncome)
    }

    $scope.deleteExpense = (expense) => {
      $localStorage.appData.expenses.splice($localStorage.appData.expenses.indexOf(expense), 1)
    }

    $scope.deleteIncome = (income) => {
      $localStorage.appData.incomes.splice($localStorage.appData.incomes.indexOf(income), 1)
    }

    $scope.hideExpenseForm = true
    $scope.hideIncomesForm = true

    function updateData () {
      if (typeof $localStorage.appData === 'undefined') return

      let expenses = $localStorage.appData.expenses
      let incomes = $localStorage.appData.incomes
      let categories = $localStorage.appData.categories

      $scope.categories = categories

      $scope.dailyExpenses = _.chain(expenses)
        .map(expense => {
          const category = categories.find(category => category.id === expense.category)
          if (category) {
            expense.categoryName = category.name
            expense.categoryColour = category.colour
          }
          return expense
        })
        .filter(expense => {
          const date = new Date(expense.date)
          return date.getFullYear() === $scope.selectedYear && date.getMonth() === $scope.selectedMonth
        })
        .groupBy(expense => new Date(expense.date).getDate())
        .mapObject(day => {
          const date = new Date(day[0].date)
          return {
            expenses: [...day],
            totalAmount: totalAmount(day),
            dayOfWeek: days[date.getDay()]
          }
        })
        .value()

      $scope.dailyIncomes = _.chain(incomes)
        .filter(expense => {
          const date = new Date(expense.date)
          return date.getFullYear() === $scope.selectedYear && date.getMonth() === $scope.selectedMonth
        })
        .groupBy(income => new Date(income.date).getDate())
        .mapObject(day => {
          const date = new Date(day[0].date)
          return {
            income: [...day],
            totalAmount: totalAmount(day),
            dayOfWeek: days[date.getDay()]
          }
        })
        .value()

      $scope.years = _.chain(expenses)
        .union(incomes)
        .groupBy(entry => new Date(entry.date).getFullYear())
        .keys()
        .map(year => parseInt(year))
        .value()

      $scope.selectedCurrency = $localStorage.appData.settings.currency

      const amountLeft = ((totalAmount(incomes) - totalAmount(expenses)) / daysInMonth(now.getMonth() + 1, now.getYear()))
      $scope.amountLeft = amountLeft > 0 ? amountLeft : 0

      // expense form
      $scope.expense = {}
      $scope.expense.date = now

      $scope.expense.category = categories[0]

      // income form
      $scope.income = {}
      $scope.income.date = now
    }
  }])
