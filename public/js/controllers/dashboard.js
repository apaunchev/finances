/* global _, angular, firebase */

function DashboardCtrlConfig ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'templates/dashboard.html',
    controller: 'DashboardCtrl'
  })
}

function DashboardCtrl ($scope, $timeout, $filter, firebaseDataService) {
  const { categories, currentUserTransactions, currentUserSettings } = firebaseDataService
  const totalAmount = $filter('totalAmount')
  const now = new Date()

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  $scope.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  $scope.selectedMonth = now.getMonth()
  $scope.selectedYear = now.getFullYear()

  $scope.transactions = currentUserTransactions
  $scope.settings = currentUserSettings
  $scope.categories = categories

  $scope.transaction = {}
  $scope.transaction.date = now

  $scope.hideForm = true

  $scope.categories.$loaded()
    .then(categories => {
      $scope.transaction.category = categories[0]

      $scope.transactions.$loaded()
        .then(transactions => {
          if (transactions.length === 0) {
            transactions.$add({
              date: firebase.database.ServerValue.TIMESTAMP,
              description: 'Demo transaction',
              amount: -10,
              category: '-KfX8vv9iXVQ1f7mQzFD'
            })
          }
          updateData(transactions)
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))

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
        return {
          transactions: [...daily],
          totalAmount: totalAmount(daily),
          dayOfWeek: days[date.getDay()]
        }
      })
      .value()

    $scope.years = _.chain(transactions)
      .groupBy(entry => new Date(entry.date).getFullYear())
      .keys()
      .map(year => parseInt(year))
      .value()

    $scope.months = _.chain(transactions)
      .groupBy(entry => new Date(entry.date).getMonth())
      .keys()
      .map(month => parseInt(month))
      .value()
  }
}

angular.module('finances.dashboard', ['ngRoute', 'firebase'])
  .config(['$routeProvider', DashboardCtrlConfig])
  .controller('DashboardCtrl', ['$scope', '$timeout', '$filter', 'firebaseDataService', DashboardCtrl])
