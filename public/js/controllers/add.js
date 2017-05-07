/* global angular */

(function () {
  'use strict'

  angular
    .module('finances.add', [])
    .config(config)
    .controller('AddCtrl', AddCtrl)

  config.$inject = ['$routeProvider']
  function config ($routeProvider) {
    $routeProvider.when('/add', {
      templateUrl: 'templates/add.html',
      controller: 'AddCtrl',
      resolve: {
        'currentAuth': ['authService', function (authService) {
          return authService.requireSignIn()
        }]
      }
    })
  }

  AddCtrl.$inject = ['$q', '$location', 'firebaseDataService']
  function AddCtrl ($q, $location, firebaseDataService) {
    const vm = this
    const { transactions, categories } = firebaseDataService
    const now = new Date()

    vm.transaction = {}
    vm.transaction.date = now
    vm.addTransaction = addTransaction

    $q.all([
      categories.$loaded(),
      transactions.$loaded()
    ])
      .then(data => {
        vm.categories = categories
        vm.transaction.category = vm.categories[0]
      })
      .catch(err => console.error(err))

    function addTransaction () {
      const transaction = {
        date: new Date(vm.transaction.date).getTime(),
        description: vm.transaction.description ? vm.transaction.description : vm.transaction.category.name,
        amount: parseFloat(vm.transaction.amount),
        category: vm.transaction.category.$id
      }
      transactions.$add(transaction).then(() => $location.path('/dashboard'))
    }
  }
})()
