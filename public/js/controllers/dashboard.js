/* global _, angular */

function DashboardCtrlConfig ($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl: 'templates/dashboard.html',
    controller: 'DashboardCtrl',
    resolve: {
      'currentAuth': ['authService', function (authService) {
        return authService.requireSignIn()
      }]
    }
  })
}

function DashboardCtrl ($scope, $timeout, $filter, $q, firebaseDataService) {
  const { transactions, settings, categories } = firebaseDataService
  const totalAmount = $filter('totalAmount')
  const now = new Date()

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  $scope.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  $scope.months = [...Array(12).keys()]
  $scope.years = fillYears()
  $scope.selectedMonth = now.getMonth()
  $scope.selectedYear = now.getFullYear()

  $scope.transactions = transactions
  $scope.settings = settings
  $scope.categories = categories

  $scope.transaction = {}
  $scope.transaction.date = now

  $scope.hideForm = true
  $scope.loading = true

  $q.all([
    $scope.categories.$loaded(),
    $scope.settings.$loaded(),
    $scope.transactions.$loaded()
  ])
    .then(() => {
      if (!$scope.settings.currency) {
        $scope.settings.currency = 'EUR'
        $scope.settings.$save()
      }

      if ($scope.categories.length === 0) {
        $scope.categories.$add({
          name: 'Unsorted',
          colour: 'dark-gray'
        })
      }

      $scope.loading = false
      $scope.transaction.category = $scope.categories[0]
      $scope.currency = $scope.settings.currency

      updateData($scope.transactions)
    })
    .catch(err => console.error(err))

  $scope.transactions.$watch(() => updateData($scope.transactions))
  $scope.$watchGroup(['selectedYear', 'selectedMonth'], () => updateData($scope.transactions))

  $scope.addTransaction = () => {
    $scope.transactions.$add({
      date: new Date($scope.transaction.date).getTime(),
      description: $scope.transaction.description ? $scope.transaction.description : $scope.transaction.category.name,
      amount: parseFloat($scope.transaction.amount),
      category: $scope.transaction.category.$id
    })
  }

  $scope.deleteTransaction = (transaction) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      $scope.transactions.$remove(transaction)
    }
  }

  function updateData (transactions) {
    $scope.dailyTransactions = _.chain(transactions)
      .map(transaction => {
        const category = $scope.categories.find(category => category.$id === transaction.category)
        if (category) {
          transaction.categoryName = category.name
          transaction.categoryColour = category.colour
        }
        return transaction
      })
      .filter(transaction => {
        const date = new Date(transaction.date)
        return date.getFullYear() === $scope.selectedYear && date.getMonth() === $scope.selectedMonth
      })
      .groupBy(transaction => new Date(transaction.date).getDate())
      .mapObject(daily => {
        const date = new Date(daily[0].date)
        const transactions = _.chain(daily).sortBy(date).reverse().value()
        return {
          transactions,
          totalAmount: totalAmount(daily),
          date: date.getDate(),
          dayOfWeek: weekDays[date.getDay()]
        }
      })
      .sortBy('date')
      .reverse()
      .value()
  }

  function fillYears () {
    const currentYear = now.getFullYear()
    let startYear = currentYear - 10
    let years = []

    while (startYear <= currentYear) {
      years.push(startYear)
      startYear = startYear + 1
    }

    return years
  }
}

angular.module('finances.dashboard', ['ngRoute', 'firebase'])
  .config(['$routeProvider', DashboardCtrlConfig])
  .controller('DashboardCtrl', ['$scope', '$timeout', '$filter', '$q', 'firebaseDataService', DashboardCtrl])
